import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, Edit } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface TimeEditorProps {
  startTime: Date;
  endTime: Date;
  onTimeChange: (startTime: Date, endTime: Date) => void;
}

export const TimeEditor = ({ startTime, endTime, onTimeChange }: TimeEditorProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(format(startTime, 'HH:mm'));
  const [tempEndTime, setTempEndTime] = useState(format(endTime, 'HH:mm'));
  const [tempStartDate, setTempStartDate] = useState(format(startTime, 'yyyy-MM-dd'));
  const [tempEndDate, setTempEndDate] = useState(format(endTime, 'yyyy-MM-dd'));

  const handleSave = () => {
    try {
      const [startHours, startMinutes] = tempStartTime.split(':').map(Number);
      const [endHours, endMinutes] = tempEndTime.split(':').map(Number);
      
      const newStartTime = new Date(tempStartDate);
      newStartTime.setHours(startHours, startMinutes, 0, 0);
      
      const newEndTime = new Date(tempEndDate);
      newEndTime.setHours(endHours, endMinutes, 0, 0);
      
      // Validate that end time is after start time
      if (newEndTime <= newStartTime) {
        alert(t('workout.endTimeAfterStart'));
        return;
      }
      
      onTimeChange(newStartTime, newEndTime);
      setIsOpen(false);
    } catch (error) {
      alert(t('workout.invalidTimeFormat'));
    }
  };

  const resetToOriginal = () => {
    setTempStartTime(format(startTime, 'HH:mm'));
    setTempEndTime(format(endTime, 'HH:mm'));
    setTempStartDate(format(startTime, 'yyyy-MM-dd'));
    setTempEndDate(format(endTime, 'yyyy-MM-dd'));
  };

  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="p-4 cursor-pointer hover:bg-muted/30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium">{t('workout.workoutTime')}</div>
                <div className="text-xs text-muted-foreground">
                  {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{duration} min</Badge>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('workout.editWorkoutTime')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">{t('workout.startDate')}</Label>
              <Input
                id="start-date"
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-time">{t('workout.startTime')}</Label>
              <Input
                id="start-time"
                type="time"
                value={tempStartTime}
                onChange={(e) => setTempStartTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="end-date">{t('workout.endDate')}</Label>
              <Input
                id="end-date"
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">{t('workout.endTime')}</Label>
              <Input
                id="end-time"
                type="time"
                value={tempEndTime}
                onChange={(e) => setTempEndTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={resetToOriginal}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1"
            >
              {t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};