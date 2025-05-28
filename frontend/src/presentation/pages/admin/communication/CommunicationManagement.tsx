import React, { useState } from 'react';
import { useAdmins, useInboxMessages, useSentMessages, useSendMessage, useMarkAsRead, useDeleteMessage } from '../../../../application/hooks/useCommunication';
import { Message, MessageForm } from '../../../../domain/types/communication';
import { Button } from '../../../../presentation/components/ui/button';
import { Input } from '../../../../presentation/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../presentation/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../presentation/components/ui/card';
import { Badge } from '../../../../presentation/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const CommunicationManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [newMessage, setNewMessage] = useState<MessageForm>({
    to: '',
    subject: '',
    content: ''
  });

  // Fetch data using hooks
  const { data: admins, isLoading: isLoadingAdmins } = useAdmins();
  const { data: inboxData, isLoading: isLoadingInbox } = useInboxMessages();
  const { data: sentData, isLoading: isLoadingSent } = useSentMessages();
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const deleteMessage = useDeleteMessage();

  const handleSendMessage = async () => {
    try {
      await sendMessage.mutateAsync(newMessage);
      toast.success('Message sent successfully');
      setIsComposing(false);
      setNewMessage({ to: '', subject: '', content: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead.mutateAsync(messageId);
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage.mutateAsync(messageId);
      toast.success('Message deleted successfully');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = (activeTab === 'inbox' ? inboxData?.messages : sentData?.messages)?.filter(
    message => message.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Communication</h2>
        <Button onClick={() => setIsComposing(true)}>New Message</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="inbox">Inbox</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <TabsContent value="inbox" className="mt-4">
          {isLoadingInbox ? (
            <div>Loading inbox...</div>
          ) : (
            <div className="grid gap-4">
              {filteredMessages?.map((message) => (
                <Card key={message.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedMessage(message)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {message.from}
                      {!message.read && <Badge className="ml-2">New</Badge>}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      {format(new Date(message.createdAt), 'MMM d, yyyy')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{message.subject}</div>
                    <p className="text-sm text-gray-500 truncate">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-4">
          {isLoadingSent ? (
            <div>Loading sent messages...</div>
          ) : (
            <div className="grid gap-4">
              {filteredMessages?.map((message) => (
                <Card key={message.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedMessage(message)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">To: {message.to}</CardTitle>
                    <div className="text-sm text-gray-500">
                      {format(new Date(message.createdAt), 'MMM d, yyyy')}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium">{message.subject}</div>
                    <p className="text-sm text-gray-500 truncate">{message.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>{selectedMessage.subject}</CardTitle>
              <div className="text-sm text-gray-500">
                {activeTab === 'inbox' ? `From: ${selectedMessage.from}` : `To: ${selectedMessage.to}`}
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
              <div className="mt-4 flex justify-end space-x-2">
                {activeTab === 'inbox' && !selectedMessage.read && (
                  <Button onClick={() => handleMarkAsRead(selectedMessage.id)}>Mark as Read</Button>
                )}
                <Button variant="destructive" onClick={() => handleDeleteMessage(selectedMessage.id)}>
                  Delete
                </Button>
                <Button onClick={() => setSelectedMessage(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compose Message Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>New Message</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">To</label>
                  <select
                    className="w-full mt-1 rounded-md border border-gray-300 p-2"
                    value={newMessage.to}
                    onChange={(e) => setNewMessage({ ...newMessage, to: e.target.value })}
                  >
                    <option value="">Select recipient</option>
                    {admins?.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    className="w-full mt-1 rounded-md border border-gray-300 p-2"
                    rows={6}
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsComposing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSendMessage} disabled={sendMessage.isPending}>
                    {sendMessage.isPending ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CommunicationManagement; 