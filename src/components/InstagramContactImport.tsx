
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInstagramContacts } from "@/hooks/useInstagramContacts";

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
}

const InstagramContactImport = () => {
  const { toast } = useToast();
  const { addContact } = useInstagramContacts();
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const usernameIndex = headers.findIndex(h => h.includes('username') || h.includes('user'));
    const nameIndex = headers.findIndex(h => h.includes('name') || h.includes('display'));
    const groupIndex = headers.findIndex(h => h.includes('group') || h.includes('категория'));
    const notesIndex = headers.findIndex(h => h.includes('notes') || h.includes('заметки'));

    if (usernameIndex === -1) {
      throw new Error('Столбец с username не найден. Убедитесь, что есть столбец "username" или "user"');
    }

    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      return {
        username: values[usernameIndex] || '',
        display_name: nameIndex !== -1 ? values[nameIndex] : '',
        group_name: groupIndex !== -1 ? values[groupIndex] : '',
        notes: notesIndex !== -1 ? values[notesIndex] : '',
        lineNumber: index + 2
      };
    }).filter(contact => contact.username);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверяем тип файла
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast({
        title: "Ошибка",
        description: "Поддерживаются только CSV файлы",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    setProgress(0);
    setImportResult(null);

    try {
      const text = await file.text();
      const contacts = parseCSV(text);

      if (contacts.length === 0) {
        throw new Error('В файле не найдено контактов для импорта');
      }

      const result: ImportResult = {
        success: 0,
        failed: 0,
        errors: []
      };

      // Импортируем контакты по одному
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        setProgress((i / contacts.length) * 100);

        try {
          const addedContact = await addContact({
            username: contact.username,
            display_name: contact.display_name || undefined,
            group_name: contact.group_name || undefined,
            notes: contact.notes || undefined
          });

          if (addedContact) {
            result.success++;
          } else {
            result.failed++;
            result.errors.push(`Строка ${contact.lineNumber}: Не удалось добавить ${contact.username}`);
          }
        } catch (error) {
          result.failed++;
          result.errors.push(`Строка ${contact.lineNumber}: ${contact.username} - ${error}`);
        }

        // Небольшая задержка для избежания перегрузки
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setProgress(100);
      setImportResult(result);

      toast({
        title: "Импорт завершен",
        description: `Успешно: ${result.success}, Ошибок: ${result.failed}`,
        variant: result.failed === 0 ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Ошибка импорта",
        description: error instanceof Error ? error.message : "Произошла ошибка при импорте",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      // Сбрасываем input
      event.target.value = '';
    }
  };

  const downloadTemplate = () => {
    const csvContent = "username,display_name,group_name,notes\nusername1,Имя Фамилия,Клиенты,Заметки\nusername2,Другое Имя,Подписчики,Другие заметки";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'instagram_contacts_template.csv';
    link.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Импорт контактов из файла
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="file-upload">Загрузить CSV файл</Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              disabled={importing}
              className="mt-1"
            />
            <p className="text-sm text-slate-500 mt-1">
              Поддерживаются CSV файлы с заголовками
            </p>
          </div>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Скачать шаблон
            </Button>
          </div>
        </div>

        {importing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Импорт контактов...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {importResult && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Успешно</p>
                  <p className="text-sm text-green-600">{importResult.success} контактов</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Ошибки</p>
                  <p className="text-sm text-red-600">{importResult.failed} контактов</p>
                </div>
              </div>
            </div>

            {importResult.errors.length > 0 && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-medium text-red-800 mb-2">Детали ошибок:</p>
                <div className="max-h-32 overflow-y-auto">
                  {importResult.errors.slice(0, 10).map((error, index) => (
                    <p key={index} className="text-sm text-red-600">{error}</p>
                  ))}
                  {importResult.errors.length > 10 && (
                    <p className="text-sm text-red-500 mt-1">
                      ... и еще {importResult.errors.length - 10} ошибок
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Формат файла:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>username</strong> (обязательно) - Instagram username без @</li>
            <li>• <strong>display_name</strong> (опционально) - Отображаемое имя</li>
            <li>• <strong>group_name</strong> (опционально) - Название группы</li>
            <li>• <strong>notes</strong> (опционально) - Заметки</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstagramContactImport;
