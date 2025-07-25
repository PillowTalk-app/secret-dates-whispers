import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Flag, Ban, Eye } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'user' | 'message';
  targetId: string;
  targetName: string;
  onReportSubmitted: () => void;
}

export const ReportModal = ({ 
  isOpen, 
  onClose, 
  targetType, 
  targetId, 
  targetName, 
  onReportSubmitted 
}: ReportModalProps) => {
  const [reportData, setReportData] = useState({
    reason: '',
    description: '',
    blockUser: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = {
    post: [
      { value: 'false_information', label: 'False or misleading information' },
      { value: 'inappropriate_content', label: 'Inappropriate content' },
      { value: 'privacy_violation', label: 'Privacy violation' },
      { value: 'spam', label: 'Spam or fake review' },
      { value: 'harassment', label: 'Harassment or bullying' },
      { value: 'other', label: 'Other' }
    ],
    user: [
      { value: 'harassment', label: 'Harassment or inappropriate behavior' },
      { value: 'fake_profile', label: 'Fake profile or catfishing' },
      { value: 'safety_concern', label: 'Safety concern' },
      { value: 'inappropriate_content', label: 'Inappropriate content' },
      { value: 'spam', label: 'Spam or fake account' },
      { value: 'other', label: 'Other' }
    ],
    message: [
      { value: 'harassment', label: 'Harassment or inappropriate language' },
      { value: 'threats', label: 'Threats or intimidation' },
      { value: 'spam', label: 'Spam or unwanted messages' },
      { value: 'inappropriate_content', label: 'Inappropriate content' },
      { value: 'other', label: 'Other' }
    ]
  };

  const handleSubmit = async () => {
    if (!reportData.reason || !reportData.description) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Reset form
    setReportData({
      reason: '',
      description: '',
      blockUser: false
    });
    
    setIsSubmitting(false);
    onReportSubmitted();
    onClose();
  };

  const getTargetTypeLabel = () => {
    switch (targetType) {
      case 'post': return 'post';
      case 'user': return 'user';
      case 'message': return 'message';
      default: return 'content';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-none shadow-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-gray-900">
            <Flag className="h-5 w-5 text-red-500" />
            <span>Report {getTargetTypeLabel()}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Help us keep the community safe by reporting inappropriate content or behavior.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Reporting:</strong> {targetName}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">
              Reason for report
            </label>
            <Select 
              value={reportData.reason} 
              onValueChange={(value) => setReportData(prev => ({ ...prev, reason: value }))}
            >
              <SelectTrigger className="border-gray-200">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200">
                {reportReasons[targetType].map((reason) => (
                  <SelectItem key={reason.value} value={reason.value} className="hover:bg-gray-50 text-black">
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">
              Additional details
            </label>
            <Textarea
              placeholder="Please provide specific details about what happened. This helps our moderation team take appropriate action."
              value={reportData.description}
              onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
              className="border-gray-200 min-h-[100px]"
            />
          </div>

          {targetType === 'user' && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <Ban className="h-4 w-4 text-red-500 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">
                  Block this user
                </p>
                <p className="text-xs text-red-600">
                  They won't be able to message you or see your posts
                </p>
              </div>
              <input
                type="checkbox"
                checked={reportData.blockUser}
                onChange={(e) => setReportData(prev => ({ ...prev, blockUser: e.target.checked }))}
                className="rounded border-red-300 text-red-600 focus:ring-red-500"
              />
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Eye className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="space-y-1 text-xs">
                  <li>• Your report will be reviewed within 24 hours</li>
                  <li>• We'll take appropriate action if violations are found</li>
                  <li>• You'll receive an update on the outcome</li>
                  <li>• Reports are anonymous and confidential</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              variant="ghost" 
              onClick={onClose} 
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!reportData.reason || !reportData.description || isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};