import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const currentAffairSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

type CurrentAffairFormValues = z.infer<typeof currentAffairSchema>;

interface CurrentAffairFormProps {
  onSubmit: (data: CurrentAffairFormValues) => void;
  defaultValues?: CurrentAffairFormValues;
}

export const CurrentAffairForm: React.FC<CurrentAffairFormProps> = ({ onSubmit, defaultValues }) => {
  const form = useForm<CurrentAffairFormValues>({
    resolver: zodResolver(currentAffairSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const handleSubmit = (data: CurrentAffairFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter content" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};