import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Application {
  id: number;
  jobName: string;
  company: string;
  status: "Applied" | "Shortlisted" | "Rejected";
  appliedAt: string;
  location: string;
}

interface ApplicationCardProps {
  application: Application;
}

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Applied":
        return "default";
      case "Shortlisted":
        return "secondary";
      case "Rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{application.jobName}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{application.company}</p>
          </div>
          <Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{application.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Applied {new Date(application.appliedAt).toLocaleDateString("en-GB")}</span>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{application.jobName}</DialogTitle>
                <DialogDescription>{application.company}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Application Status</h4>
                  <Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">{application.location}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Applied Date</h4>
                  <p className="text-sm text-muted-foreground">{new Date(application.appliedAt).toLocaleDateString("en-GB")}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Job Description</h4>
                  <p className="text-sm text-muted-foreground">
                   {/* {application.} */}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
