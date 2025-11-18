#!/usr/bin/env tsx

/**
 * HITL Resume Script
 *
 * Scans docs/hitl/ directory for HITL files, categorizes by status,
 * and generates a summary report for Claude Code to resume work.
 *
 * Usage:
 *   pnpm hitl:resume
 *   or: tsx scripts/hitl-resume.ts
 */

import fs from 'fs/promises'
import path from 'path'

interface HITLFile {
  filename: string
  path: string
  title: string
  date: string
  category: string
  related: string
  status: 'PENDING' | 'APPROVED' | 'NEEDS_REVISION' | 'REJECTED'
  feedback?: string
}

interface HITLSummary {
  approved: HITLFile[]
  needsRevision: HITLFile[]
  rejected: HITLFile[]
  pending: HITLFile[]
}

const HITL_DIR = path.join(process.cwd(), 'docs', 'hitl')

async function parseHITLFile(filePath: string): Promise<HITLFile | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8')

    // Extract metadata using regex
    const titleMatch = content.match(/# HITL Request: (.+)/)
    const dateMatch = content.match(/\*\*Date\*\*: (.+)/)
    const categoryMatch = content.match(/\*\*Category\*\*: `?([^`\n]+)`?/)
    const relatedMatch = content.match(/\*\*Related\*\*: (.+)/)
    const statusMatch = content.match(/\*\*Status\*\*: `?([^`\n]+)`?/)

    // Extract human feedback if NEEDS_REVISION
    const feedbackMatch = content.match(/\*\*Feedback\/Instructions\*\*:\s*\n(.+?)(?=\n\*\*|$)/s)

    if (!titleMatch || !statusMatch) {
      console.warn(`⚠️  Could not parse ${path.basename(filePath)} - missing required fields`)
      return null
    }

    return {
      filename: path.basename(filePath),
      path: filePath,
      title: titleMatch[1].trim(),
      date: dateMatch ? dateMatch[1].trim() : 'Unknown',
      category: categoryMatch ? categoryMatch[1].trim() : 'other',
      related: relatedMatch ? relatedMatch[1].trim() : 'None',
      status: statusMatch[1].trim() as HITLFile['status'],
      feedback: feedbackMatch ? feedbackMatch[1].trim() : undefined
    }
  } catch (error) {
    console.error(`❌ Error parsing ${filePath}:`, error)
    return null
  }
}

async function scanHITLDirectory(): Promise<HITLFile[]> {
  try {
    const files = await fs.readdir(HITL_DIR)
    const hitlFiles = files.filter(f =>
      f.startsWith('hitl-') &&
      f.endsWith('.md') &&
      !f.includes('template')
    )

    const parsed = await Promise.all(
      hitlFiles.map(async (filename) => {
        const filePath = path.join(HITL_DIR, filename)
        return parseHITLFile(filePath)
      })
    )

    return parsed.filter((f): f is HITLFile => f !== null)
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('📁 HITL directory does not exist yet. Creating...')
      await fs.mkdir(HITL_DIR, { recursive: true })
      return []
    }
    throw error
  }
}

function categorizeby Status(files: HITLFile[]): HITLSummary {
  return {
    approved: files.filter(f => f.status === 'APPROVED'),
    needsRevision: files.filter(f => f.status === 'NEEDS_REVISION'),
    rejected: files.filter(f => f.status === 'REJECTED'),
    pending: files.filter(f => f.status === 'PENDING')
  }
}

function groupByCategory(files: HITLFile[]): Map<string, HITLFile[]> {
  const groups = new Map<string, HITLFile[]>()

  for (const file of files) {
    const category = file.category
    if (!groups.has(category)) {
      groups.set(category, [])
    }
    groups.get(category)!.push(file)
  }

  return groups
}

function generateReport(summary: HITLSummary): string {
  const total = summary.approved.length + summary.needsRevision.length +
                summary.rejected.length + summary.pending.length

  const report: string[] = []

  report.push('═'.repeat(60))
  report.push('  HITL Resume Report')
  report.push(`  ${new Date().toISOString().split('T')[0]}`)
  report.push('═'.repeat(60))
  report.push('')

  // Summary stats
  report.push('📊 Summary Statistics')
  report.push('─'.repeat(60))
  report.push(`Total HITL Files: ${total}`)
  report.push(`  ✅ Approved:       ${summary.approved.length}`)
  report.push(`  🔄 Needs Revision: ${summary.needsRevision.length}`)
  report.push(`  ❌ Rejected:       ${summary.rejected.length}`)
  report.push(`  ⏳ Pending:        ${summary.pending.length}`)
  report.push('')

  // Approved items
  if (summary.approved.length > 0) {
    report.push('✅ APPROVED Items')
    report.push('─'.repeat(60))

    const byCategory = groupByCategory(summary.approved)
    byCategory.forEach((files, category) => {
      report.push(`\n${category.toUpperCase()}: ${files.length} items`)
      files.forEach(f => {
        report.push(`  • ${f.title}`)
        report.push(`    Related: ${f.related}`)
        report.push(`    File: ${f.filename}`)
      })
    })
    report.push('')
  }

  // Needs revision items
  if (summary.needsRevision.length > 0) {
    report.push('🔄 NEEDS REVISION Items')
    report.push('─'.repeat(60))

    summary.needsRevision.forEach(f => {
      report.push(`\n• ${f.title}`)
      report.push(`  Category: ${f.category}`)
      report.push(`  Related: ${f.related}`)
      report.push(`  File: ${f.filename}`)
      if (f.feedback) {
        report.push(`  Human Feedback:`)
        const feedbackLines = f.feedback.split('\n')
        feedbackLines.forEach(line => {
          if (line.trim()) report.push(`    ${line.trim()}`)
        })
      }
    })
    report.push('')
  }

  // Rejected items
  if (summary.rejected.length > 0) {
    report.push('❌ REJECTED Items')
    report.push('─'.repeat(60))

    summary.rejected.forEach(f => {
      report.push(`\n• ${f.title}`)
      report.push(`  Category: ${f.category}`)
      report.push(`  Related: ${f.related}`)
      report.push(`  File: ${f.filename}`)
      if (f.feedback) {
        report.push(`  Rejection Reason:`)
        const feedbackLines = f.feedback.split('\n')
        feedbackLines.forEach(line => {
          if (line.trim()) report.push(`    ${line.trim()}`)
        })
      }
    })
    report.push('')
  }

  // Pending items
  if (summary.pending.length > 0) {
    report.push('⏳ PENDING Review')
    report.push('─'.repeat(60))
    report.push(`${summary.pending.length} items still awaiting human review`)
    report.push('')
    const byCategory = groupByCategory(summary.pending)
    byCategory.forEach((files, category) => {
      report.push(`${category}: ${files.length} items`)
      files.forEach(f => {
        report.push(`  • ${f.title} (${f.filename})`)
      })
    })
    report.push('')
    report.push('💡 Review these items and update their status, then run this command again.')
    report.push('')
  }

  // Next steps
  report.push('📋 Next Steps')
  report.push('─'.repeat(60))

  if (summary.pending.length > 0) {
    report.push('⚠️  Not all items have been reviewed yet.')
    report.push('   1. Review pending items in docs/hitl/')
    report.push('   2. Update status in each file')
    report.push('   3. Run: pnpm hitl:resume')
  } else if (summary.approved.length > 0 || summary.needsRevision.length > 0) {
    report.push('✨ All items reviewed! Ready to continue.')
    report.push('')
    if (summary.approved.length > 0) {
      report.push(`Proceed with ${summary.approved.length} approved items:`)
      const byCategory = groupByCategory(summary.approved)
      byCategory.forEach((files, category) => {
        report.push(`  • ${category}: ${files.map(f => f.related).join(', ')}`)
      })
    }
    if (summary.needsRevision.length > 0) {
      report.push('')
      report.push(`Revise ${summary.needsRevision.length} items based on feedback:`)
      summary.needsRevision.forEach(f => {
        report.push(`  • ${f.related}: ${f.title}`)
      })
    }
    if (summary.rejected.length > 0) {
      report.push('')
      report.push(`Archive ${summary.rejected.length} rejected items.`)
    }
  } else if (summary.rejected.length > 0) {
    report.push('All items were rejected. Review rejection reasons and create new approach.')
  } else {
    report.push('No HITL files found. You\'re all caught up!')
  }

  report.push('')
  report.push('═'.repeat(60))

  return report.join('\n')
}

async function archiveProcessedFiles(summary: HITLSummary): Promise<void> {
  const archiveDir = path.join(HITL_DIR, 'archive', new Date().toISOString().split('T')[0])

  const toArchive = [
    ...summary.approved,
    ...summary.rejected
  ]

  if (toArchive.length === 0) return

  await fs.mkdir(archiveDir, { recursive: true })

  for (const file of toArchive) {
    const newPath = path.join(archiveDir, file.filename)
    await fs.rename(file.path, newPath)
    console.log(`📦 Archived: ${file.filename}`)
  }

  console.log(`\n✅ Archived ${toArchive.length} processed files to ${archiveDir}`)
}

async function main() {
  console.log('🔍 Scanning HITL files...\n')

  const files = await scanHITLDirectory()

  if (files.length === 0) {
    console.log('✨ No HITL files found. You\'re all caught up!')
    return
  }

  const summary = categorizeByStatus(files)
  const report = generateReport(summary)

  console.log(report)

  // Optionally archive processed files (uncomment to enable)
  // if (summary.approved.length > 0 || summary.rejected.length > 0) {
  //   const readline = await import('readline')
  //   const rl = readline.createInterface({
  //     input: process.stdin,
  //     output: process.stdout
  //   })
  //
  //   rl.question('\n📦 Archive processed files? (y/N): ', async (answer) => {
  //     if (answer.toLowerCase() === 'y') {
  //       await archiveProcessedFiles(summary)
  //     }
  //     rl.close()
  //   })
  // }

  // Save report to file
  const reportPath = path.join(HITL_DIR, `resume-report-${new Date().toISOString().split('T')[0]}.txt`)
  await fs.writeFile(reportPath, report)
  console.log(`\n📄 Report saved to: ${reportPath}`)
}

main().catch(console.error)
