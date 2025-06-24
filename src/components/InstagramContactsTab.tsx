
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Instagram, Trash2, Users, Upload } from "lucide-react";
import { useInstagramContacts } from "@/hooks/useInstagramContacts";
import InstagramContactImport from "./InstagramContactImport";

const InstagramContactsTab = () => {
  const { contacts, loading, addContact, deleteContact, toggleContactStatus } = useInstagramContacts();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    username: "",
    display_name: "",
    group_name: "",
    notes: ""
  });

  const handleAddContact = async () => {
    const result = await addContact(newContact);
    if (result) {
      setNewContact({ username: "", display_name: "", group_name: "", notes: "" });
      setShowAddForm(false);
    }
  };

  const activeContacts = contacts.filter(c => c.is_active).length;
  const totalContacts = contacts.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Загрузка контактов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Instagram Контакты</h2>
          <p className="text-slate-600">
            Активных: {activeContacts} из {totalContacts} контактов
          </p>
        </div>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Добавить контакт
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Импорт из файла
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual">
          {/* Manual Add Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Добавить Instagram контакт</CardTitle>
              <CardDescription>
                Укажите Instagram username для отправки DM сообщений
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="username">Instagram Username *</Label>
                  <Input
                    id="username"
                    placeholder="@username или username"
                    value={newContact.username}
                    onChange={(e) => setNewContact({...newContact, username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="display_name">Отображаемое имя</Label>
                  <Input
                    id="display_name"
                    placeholder="Иван Петров"
                    value={newContact.display_name}
                    onChange={(e) => setNewContact({...newContact, display_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="group_name">Группа</Label>
                  <Input
                    id="group_name"
                    placeholder="Клиенты, Подписчики и т.д."
                    value={newContact.group_name}
                    onChange={(e) => setNewContact({...newContact, group_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Заметки</Label>
                  <Textarea
                    id="notes"
                    placeholder="Дополнительная информация"
                    value={newContact.notes}
                    onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleAddContact}>
                  Добавить контакт
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <InstagramContactImport />
        </TabsContent>
      </Tabs>

      {/* Contacts List */}
      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact) => (
          <Card key={contact.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      @{contact.username}
                    </h3>
                    {contact.display_name && (
                      <p className="text-slate-600">{contact.display_name}</p>
                    )}
                    {contact.group_name && (
                      <Badge variant="outline" className="mt-1">
                        {contact.group_name}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Badge className={contact.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {contact.is_active ? 'Активен' : 'Неактивен'}
                  </Badge>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-600">Активен</span>
                    <Switch
                      checked={contact.is_active}
                      onCheckedChange={() => toggleContactStatus(contact.id)}
                    />
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {contact.notes && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">Заметки:</p>
                  <p className="text-sm text-slate-800">{contact.notes}</p>
                </div>
              )}
              
              <div className="mt-4 text-xs text-slate-500">
                Добавлен: {new Date(contact.created_at).toLocaleDateString('ru-RU')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              Нет добавленных контактов
            </h3>
            <p className="text-slate-500 mb-4">
              Добавьте Instagram контакты для DM рассылки вручную или через импорт файла
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstagramContactsTab;
