import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Clock, Bookmark } from "lucide-react";

const QuickStats = () => {
  const stats = [
    {
      title: "Applied Jobs",
      value: "12",
      icon: Briefcase,
      description: "Total applications",
    },
    {
      title: "Pending",
      value: "8",
      icon: Clock,
      description: "Awaiting response",
    },
    {
      title: "Bookmarked",
      value: "5",
      icon: Bookmark,
      description: "Saved for later",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))} */}
    </div>
  );
};

export default QuickStats;
