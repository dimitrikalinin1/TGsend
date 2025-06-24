
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Zap, Bot, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface PostSchedulerProps {
  postId: string;
  onSchedulePost: (id: string, scheduledAt?: Date) => void;
  onPublishNow: (id: string) => void;
  currentScheduledAt?: Date;
  isEditing?: boolean;
}

const PostScheduler = ({ 
  postId, 
  onSchedulePost, 
  onPublishNow, 
  currentScheduledAt,
  isEditing = false 
}: PostSchedulerProps) => {
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentScheduledAt);
  const [selectedTime, setSelectedTime] = useState(() => {
    if (currentScheduledAt) {
      const hours = currentScheduledAt.getHours().toString().padStart(2, '0');
      const minutes = currentScheduledAt.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return "12:00";
  });
  const [useAutoTiming, setUseAutoTiming] = useState(false);

  const handleManualSchedule = () => {
    if (selectedDate) {
      const [hours, minutes] = selectedTime.split(':');
      const scheduledDateTime = new Date(selectedDate);
      scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
      onSchedulePost(postId, scheduledDateTime);
    }
    setShowScheduler(false);
  };

  const handleAutoSchedule = () => {
    // ИИ выберет оптимальное время
    onSchedulePost(postId);
    setShowScheduler(false);
  };

  const handlePublishNow = () => {
    onPublishNow(postId);
    setShowScheduler(false);
  };

  const buttonText = isEditing ? "Изменить" : "Планировать";
  const buttonIcon = isEditing ? <Edit3 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />;

  return (
    <Dialog open={showScheduler} onOpenChange={setShowScheduler}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="text-xs h-7 flex-1">
          {buttonIcon}
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Изменить время публикации" : "Планирование публикации"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Измените дату и время публикации" : "Выберите когда опубликовать пост"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            <div>
              <Label>Дата публикации</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd.MM.yyyy") : "Выберите дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="time">Время публикации</Label>
              <Input
                id="time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleManualSchedule}
              disabled={!selectedDate}
              className="flex-1"
            >
              <Clock className="h-4 w-4 mr-2" />
              Запланировать
            </Button>
            <Button
              onClick={handleAutoSchedule}
              variant="outline"
              className="flex-1"
            >
              <Bot className="h-4 w-4 mr-2" />
              ИИ время
            </Button>
          </div>

          <div className="border-t pt-2">
            <Button
              onClick={handlePublishNow}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              <Zap className="h-4 w-4 mr-2" />
              Опубликовать сейчас
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostScheduler;
