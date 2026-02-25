"use client";

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  createTipSchema,
  CreateTipSchemaType,
} from "@/constants/validations/blogs";
import useBlogs from "@/hooks/use-blogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TipCategory } from "@/redux/features/blogs-api";

function CreateTips() {
  const { 
    createTips, 
    creatingTip, 
    sendTestTip, 
    sendingTestTip,
    tipCategories,
    loadingTipCategories 
  } = useBlogs({ 
    fetchTipCategories: true
  });
  
  // Transform tip categories to select options format
  const categoryOptions = (tipCategories || []).map((category: TipCategory) => ({
    label: category.name,
    value: category.name,
  }));

  // Fix: Set a valid default value that matches the schema
  const automatedForm = useForm<CreateTipSchemaType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      content: "",
      category: "Safety", // Changed from "" to a valid enum value
    },
  });

  const instantForm = useForm<CreateTipSchemaType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      content: "",
      category: "Safety", // Changed from "" to a valid enum value
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Automated */}
      <Card>
        <CardHeader>
          <CardTitle>Create Automated Tips</CardTitle>
          <p className="text-sm text-muted-foreground">
            These tips are automatically scheduled and sent at 7:00 AM and 4:00
            PM daily.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...automatedForm}>
            <form
              onSubmit={automatedForm.handleSubmit(createTips)}
              className="space-y-6"
            >
              <ReusableFormField
                control={automatedForm.control}
                name="content"
                fieldType="textarea"
                placeholder="Enter the automated tip content here..."
                className="placeholder:text-muted-foreground min-h-[120px]"
              />

              <ReusableFormField
                control={automatedForm.control}
                name="category"
                fieldType="select"
                placeholder={loadingTipCategories ? "Loading tip categories..." : "Select a tip category"}
                disabled={loadingTipCategories}
                options={categoryOptions}
              />

              <Button 
                disabled={creatingTip || loadingTipCategories} 
                type="submit"
                className="w-full"
              >
                {creatingTip ? "Processing..." : "Create Automated Tip"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Instant */}
      <Card>
        <CardHeader>
          <CardTitle>Create Instant Tips</CardTitle>
          <p className="text-sm text-muted-foreground">
            These tips are sent immediately and notify all organizations and
            users in real time.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...instantForm}>
            <form
              onSubmit={instantForm.handleSubmit(sendTestTip)}
              className="space-y-6"
            >
              <ReusableFormField
                control={instantForm.control}
                name="content"
                fieldType="textarea"
                placeholder="Enter the instant tip content here..."
                className="placeholder:text-muted-foreground min-h-[120px]"
              />

              <ReusableFormField
                control={instantForm.control}
                name="category"
                fieldType="select"
                placeholder={loadingTipCategories ? "Loading tip categories..." : "Select a tip category"}
                disabled={loadingTipCategories}
                options={categoryOptions}
              />

              <Button 
                disabled={sendingTestTip || loadingTipCategories} 
                type="submit"
                className="w-full"
              >
                {sendingTestTip ? "Processing..." : "Send Instant Tip"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateTips;