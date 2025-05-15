// presentation/components/user/UserForm.tsx
import React from 'react';
import { useUserManagement } from '../../../application/hooks/useUserManagement';
import { Input } from '../Input';
import { Button } from '../Button';
import { Form } from '../Form';

interface UserFormProps {
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onClose }) => {
  const { createUser, isCreating } = useUserManagement();
  const [formData, setFormData] = React.useState({ name: '', email: '', role: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <Input
        label="Role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      />
      <Button type="submit" disabled={isCreating}>
        {isCreating ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
};

export default UserForm;