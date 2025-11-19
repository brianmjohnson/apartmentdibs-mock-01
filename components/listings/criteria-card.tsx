"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  CreditCard,
  FileWarning,
  Calendar,
  Phone,
  Heart,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface CriteriaCardProps {
  price: number;
  criteria: {
    incomeRatio: number;
    minCredit: number;
    maxEvictionYears: number;
  };
  available: string;
  listingId: string;
}

export function CriteriaCard({ price, criteria, available, listingId }: CriteriaCardProps) {
  const requiredIncome = criteria.incomeRatio <= 5
    ? price * criteria.incomeRatio * 12
    : price * criteria.incomeRatio;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">
          ${price.toLocaleString()}
          <span className="text-base font-normal text-muted-foreground">/month</span>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          Available {formatDate(available)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Button className="w-full" size="lg" asChild>
          <Link href={`/search/${listingId}/apply`}>
            Apply Now
          </Link>
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Tour
          </Button>
          <Button variant="outline" className="w-full">
            <Heart className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>

        <Separator />

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h4 className="font-semibold text-sm">Qualification Requirements</h4>
          </div>

          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Income Requirement</span>
                <p className="text-muted-foreground">
                  {criteria.incomeRatio <= 5
                    ? `${criteria.incomeRatio}x monthly rent ($${requiredIncome.toLocaleString()}/year)`
                    : `${criteria.incomeRatio}x annual rent ($${requiredIncome.toLocaleString()}/year)`
                  }
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Credit Score</span>
                <p className="text-muted-foreground">
                  Minimum {criteria.minCredit}+
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <FileWarning className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Eviction History</span>
                <p className="text-muted-foreground">
                  No evictions in past {criteria.maxEvictionYears} years
                </p>
              </div>
            </li>
          </ul>
        </div>

        <Separator />

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
            <Phone className="h-4 w-4" />
            Contact Agent
          </div>
          <p className="text-xs text-muted-foreground">
            Contact information available after application
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
