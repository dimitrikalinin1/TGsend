
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useInstagramAutoPosts } from "@/hooks/useInstagramAutoPosts";
import ImageUploader from "./ImageUploader";

const STYLE_OPTIONS = [
  { value: 'motivational', label: 'Мотивирующий' },
  { value: 'playful', label: 'Игривый' },
  { value: 'professional', label: 'Профессиональный' },
  { value: 'casual', label: 'Непринужденный' },
  { value: 'inspirational', label: 'Вдохновляющий' },
  { value: 'educational', label: 'Образовательный' },
  { value: 'funny', label: 'Веселый' },
  { value: 'emotional', label: 'Эмоциональный' },
];

const LANGUAGE_OPTIONS = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'pt', label: 'Português' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
];

const AutoPostCreateForm = () => {
  const { createAutoPost } = useInstagramAutoPosts();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    content_url: '',
    style_prompt: '',
    language: 'ru'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content_url || !formData.style_prompt || !formData.language) {
      return;
    }

    const result = await createAutoPost({
      title: 'Автоматически созданный пост',
      style_prompt: `${formData.style_prompt}|${formData.language}`,
      content_url: formData.content_url,
      content_type: 'image'
    });
    
    if (result) {
      setShowCreateForm(false);
      setFormData({
        content_url: '',
        style_prompt: '',
        language: 'ru'
      });
    }
  };

  return (
    <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Создать автопост
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать автопост</DialogTitle>
          <DialogDescription>
            Загрузите изображение, выберите стиль и язык - ИИ сам создаст описание и хештеги
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Загрузите изображение</Label>
            <ImageUploader
              onImageUploaded={(url) => setFormData({ ...formData, content_url: url })}
              currentImage={formData.content_url}
            />
          </div>
          
          <div>
            <Label htmlFor="style">Стиль поста</Label>
            <Select
              value={formData.style_prompt}
              onValueChange={(value) => setFormData({ ...formData, style_prompt: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите стиль" />
              </SelectTrigger>
              <SelectContent>
                {STYLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="language">Язык контента</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите язык" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-pink-500 to-purple-500"
              disabled={!formData.content_url || !formData.style_prompt || !formData.language}
            >
              Создать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AutoPostCreateForm;
