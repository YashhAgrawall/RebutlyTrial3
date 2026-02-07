import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Mic, 
  MicOff, 
  Download, 
  Tag,
  Highlighter,
  Plus,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface Note {
  id: string;
  content: string;
  tab: 'arguments' | 'rebuttals' | 'examples';
  color: 'default' | 'red' | 'yellow' | 'green' | 'blue';
  timestamp: Date;
  tags: string[];
}

interface DebateNotesProps {
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  voiceSupported?: boolean;
  currentPhase?: string;
  debateTopic?: string;
  userSide?: string;
  // Lifted state props for persistence
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
  activeTab: 'arguments' | 'rebuttals' | 'examples';
  onActiveTabChange: (tab: 'arguments' | 'rebuttals' | 'examples') => void;
  currentNote: string;
  onCurrentNoteChange: (note: string) => void;
  currentColor: 'default' | 'red' | 'yellow' | 'green' | 'blue';
  onCurrentColorChange: (color: 'default' | 'red' | 'yellow' | 'green' | 'blue') => void;
  currentTags: string[];
  onCurrentTagsChange: (tags: string[]) => void;
}

const COLOR_OPTIONS = [
  { value: 'default', label: 'Default', class: 'bg-muted' },
  { value: 'red', label: 'Red', class: 'bg-destructive/20 border-destructive/50' },
  { value: 'yellow', label: 'Yellow', class: 'bg-warning/20 border-warning/50' },
  { value: 'green', label: 'Green', class: 'bg-success/20 border-success/50' },
  { value: 'blue', label: 'Blue', class: 'bg-primary/20 border-primary/50' },
] as const;

type ColorValue = typeof COLOR_OPTIONS[number]['value'];

const TAB_OPTIONS = [
  { value: 'arguments', label: 'Arguments', icon: FileText },
  { value: 'rebuttals', label: 'Rebuttals', icon: Tag },
  { value: 'examples', label: 'Examples', icon: Highlighter },
] as const;

type TabValue = typeof TAB_OPTIONS[number]['value'];

export function DebateNotes({
  isRecording = false,
  onStartRecording,
  onStopRecording,
  voiceSupported = false,
  currentPhase = '',
  debateTopic = '',
  userSide = '',
  notes,
  onNotesChange,
  activeTab,
  onActiveTabChange,
  currentNote,
  onCurrentNoteChange,
  currentColor,
  onCurrentColorChange,
  currentTags,
  onCurrentTagsChange,
}: DebateNotesProps) {
  const [tagInput, setTagInput] = useState('');

  const addNote = useCallback(() => {
    if (!currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      content: currentNote.trim(),
      tab: activeTab,
      color: currentColor,
      timestamp: new Date(),
      tags: currentTags,
    };

    onNotesChange([...notes, newNote]);
    onCurrentNoteChange('');
    onCurrentTagsChange([]);
    toast.success('Note added');
  }, [currentNote, activeTab, currentColor, currentTags, notes, onNotesChange, onCurrentNoteChange, onCurrentTagsChange]);

  const deleteNote = useCallback((id: string) => {
    onNotesChange(notes.filter(n => n.id !== id));
  }, [notes, onNotesChange]);

  const addTag = useCallback(() => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      onCurrentTagsChange([...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, currentTags, onCurrentTagsChange]);

  const removeTag = useCallback((tag: string) => {
    onCurrentTagsChange(currentTags.filter(t => t !== tag));
  }, [currentTags, onCurrentTagsChange]);

  const filteredNotes = useMemo(() => {
    return notes.filter(n => n.tab === activeTab);
  }, [notes, activeTab]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getColorClass = (color: ColorValue) => {
    return COLOR_OPTIONS.find(c => c.value === color)?.class || 'bg-muted';
  };

  const exportNotes = useCallback(() => {
    if (notes.length === 0) {
      toast.error('No notes to export');
      return;
    }

    const header = `DEBATE NOTES
================
Topic: ${debateTopic}
Side: ${userSide}
Exported: ${new Date().toLocaleString()}
================\n\n`;

    const sections = TAB_OPTIONS.map(tab => {
      const tabNotes = notes.filter(n => n.tab === tab.value);
      if (tabNotes.length === 0) return '';

      const notesText = tabNotes.map(n => {
        const tagsText = n.tags.length > 0 ? ` [${n.tags.join(', ')}]` : '';
        return `[${formatTime(n.timestamp)}]${tagsText}\n${n.content}`;
      }).join('\n\n');

      return `--- ${tab.label.toUpperCase()} ---\n${notesText}\n\n`;
    }).filter(Boolean).join('');

    const content = header + sections;

    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debate-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Notes exported successfully');
  }, [notes, debateTopic, userSide]);

  const toggleRecording = () => {
    if (isRecording) {
      onStopRecording?.();
    } else {
      onStartRecording?.();
    }
  };

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Notes
          {currentPhase && (
            <Badge variant="outline" className="text-xs">
              {currentPhase}
            </Badge>
          )}
        </h3>
        <div className="flex items-center gap-1">
          {voiceSupported && (
            <Button
              variant={isRecording ? 'destructive' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={toggleRecording}
              title={isRecording ? 'Stop dictation' : 'Start dictation'}
            >
              {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={exportNotes}
            title="Export notes"
          >
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => onActiveTabChange(v as TabValue)} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 h-8">
          {TAB_OPTIONS.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs py-1">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_OPTIONS.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="flex-1 flex flex-col mt-2">
            {/* Notes List */}
            <div className="flex-1 overflow-y-auto mb-2 space-y-2 min-h-0 max-h-[150px]">
              <AnimatePresence>
                {filteredNotes.map(note => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-2 rounded-md border text-xs relative group ${getColorClass(note.color)}`}
                  >
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-destructive/20 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(note.timestamp)}</span>
                      {note.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="whitespace-pre-wrap">{note.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredNotes.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No {tab.label.toLowerCase()} yet
                </p>
              )}
            </div>

            {/* Add Note Form */}
            <div className="space-y-2 mt-auto">
              {/* Color selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground mr-1">Color:</span>
                {COLOR_OPTIONS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => onCurrentColorChange(color.value)}
                    className={`w-5 h-5 rounded-full border-2 ${color.class} ${
                      currentColor === color.value ? 'ring-2 ring-primary ring-offset-1' : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1">
                {currentTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)}>
                      <X className="w-2 h-2" />
                    </button>
                  </Badge>
                ))}
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="text-xs bg-transparent border-none outline-none w-16 placeholder:text-muted-foreground/50"
                  />
                  {tagInput && (
                    <button onClick={addTag} className="text-primary">
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Note input */}
              <div className="flex gap-1">
                <Textarea
                  value={currentNote}
                  onChange={(e) => onCurrentNoteChange(e.target.value)}
                  placeholder="Type your note..."
                  className="text-xs min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      addNote();
                    }
                  }}
                />
                <Button
                  size="icon"
                  className="h-[60px] w-8 flex-shrink-0"
                  onClick={addNote}
                  disabled={!currentNote.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Ctrl+Enter to add</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
