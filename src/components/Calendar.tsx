"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Filter,
  Share,
  Printer,
  MoreHorizontal,
  Sun,
  Cloud,
  CloudRain
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  attendees?: string[];
  color: string;
  allDay?: boolean;
}

interface CalendarProps {
  className?: string;
}

const Calendar = ({ className = "" }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'workweek' | 'week' | 'month' | 'split'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [showNewEventDialog, setShowNewEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    description: '',
    location: '',
    allDay: false,
    color: 'blue'
  });

  // Sample events
  useEffect(() => {
    const sampleEvents: Event[] = [
      {
        id: '1',
        title: 'Team Meeting',
        start: new Date(2024, 11, 15, 10, 0),
        end: new Date(2024, 11, 15, 11, 0),
        description: 'Weekly team standup',
        location: 'Conference Room A',
        attendees: ['John Doe', 'Jane Smith'],
        color: 'blue'
      },
      {
        id: '2',
        title: 'Project Deadline',
        start: new Date(2024, 11, 20, 9, 0),
        end: new Date(2024, 11, 20, 17, 0),
        description: 'Final project submission',
        color: 'red',
        allDay: true
      },
      {
        id: '3',
        title: 'Client Presentation',
        start: new Date(2024, 11, 18, 14, 0),
        end: new Date(2024, 11, 18, 15, 30),
        description: 'Present quarterly results',
        location: 'Client Office',
        color: 'green'
      }
    ];
    setEvents(sampleEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start) return;
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: new Date(newEvent.start),
      end: new Date(newEvent.end || newEvent.start),
      description: newEvent.description,
      location: newEvent.location,
      color: newEvent.color,
      allDay: newEvent.allDay
    };
    
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      start: '',
      end: '',
      description: '',
      location: '',
      allDay: false,
      color: 'blue'
    });
    setShowNewEventDialog(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const getWeatherIcon = (date: Date) => {
    const day = date.getDate();
    if (day === 28 || day === 29 || day === 30) return <Cloud className="w-4 h-4 text-gray-500" />;
    if (day === 1) return <CloudRain className="w-4 h-4 text-blue-500" />;
    return <Sun className="w-4 h-4 text-yellow-500" />;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`flex h-full ${className}`}>
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 p-4 space-y-4">
        {/* New Event Button */}
        <Dialog open={showNewEventDialog} onOpenChange={setShowNewEventDialog}>
          <DialogTrigger asChild>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start">Start</Label>
                  <Input
                    id="start"
                    type="datetime-local"
                    value={newEvent.start}
                    onChange={(e) => setNewEvent({...newEvent, start: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="end">End</Label>
                  <Input
                    id="end"
                    type="datetime-local"
                    value={newEvent.end}
                    onChange={(e) => setNewEvent({...newEvent, end: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Enter location"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={newEvent.allDay}
                  onChange={(e) => setNewEvent({...newEvent, allDay: e.target.checked})}
                />
                <Label htmlFor="allDay">All day</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowNewEventDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent}>
                  Create Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Options */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">View</div>
          <div className="grid grid-cols-2 gap-2">
            {['Day', 'Work week', 'Week', 'Month', 'Split view'].map((viewName) => (
              <Button
                key={viewName}
                variant={view === viewName.toLowerCase().replace(' ', '') ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView(viewName.toLowerCase().replace(' ', '') as any)}
                className="text-xs"
              >
                {viewName}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Mini Calendar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="grid grid-cols-7 gap-1 text-xs">
              {dayNames.map(day => (
                <div key={day} className="text-center text-gray-500 font-medium p-1">
                  {day}
                </div>
              ))}
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`text-center p-1 cursor-pointer rounded ${
                    day && day.toDateString() === selectedDate.toDateString()
                      ? 'bg-blue-600 text-white'
                      : day && day.toDateString() === new Date().toDateString()
                      ? 'bg-blue-100 text-blue-600'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day ? day.getDate() : ''}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Calendars */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">My calendars</div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-blue-600" />
              <span className="text-sm">Calendar</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" defaultChecked className="text-pink-600" />
              <span className="text-sm">India Holidays</span>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm">Birthday calendar</span>
            </div>
          </div>
        </div>

        {/* Other Calendars */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Other calendars</div>
          <div className="text-sm text-gray-500">Your family</div>
        </div>

        {/* Groups */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Groups</div>
          <div className="text-sm text-gray-500">Your family</div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Calendar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h1>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 p-4">
          <div className="h-full">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 mb-1">
              {dayNames.map(day => (
                <div key={day} className="bg-white p-3 text-center font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-px bg-gray-200 h-full">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const isToday = day && day.toDateString() === new Date().toDateString();
                const isSelected = day && day.toDateString() === selectedDate.toDateString();
                
                return (
                  <div
                    key={index}
                    className={`bg-white p-2 min-h-[120px] ${
                      isSelected ? 'ring-2 ring-blue-600' : ''
                    } ${isToday ? 'bg-blue-50' : ''}`}
                  >
                    {day && (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium ${
                            isToday ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {day.getDate()}
                          </span>
                          {getWeatherIcon(day)}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map(event => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded truncate ${
                                event.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                                event.color === 'red' ? 'bg-red-100 text-red-800' :
                                event.color === 'green' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {event.title}
                              </div>
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - India Holidays */}
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">India Holidays</h3>
          <div className="space-y-2">
            <div className="p-2 bg-pink-50 rounded border-l-4 border-pink-500">
              <div className="text-sm font-medium">Gandhi Jay.</div>
              <div className="text-xs text-gray-500">Oct 2, 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
