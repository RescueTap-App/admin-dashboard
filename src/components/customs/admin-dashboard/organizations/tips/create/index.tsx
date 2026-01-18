"use client";

import { ReusableFormField } from "@/components/shared/forms/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  createTipSchema,
  createTipSchemaType,
} from "@/constants/validations/blogs";
import useBlogs from "@/hooks/use-blogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function CreateTips() {
  const { createTips, creatingTip, sendTestTip, sendingTestTip } =
    useBlogs({});

  // ✅ Form for Automated Tips
  const automatedForm = useForm<createTipSchemaType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      content: "",
    },
  });

  // ✅ Form for Instant Tips
  const instantForm = useForm<createTipSchemaType>({
    resolver: zodResolver(createTipSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleCreateAutomatedTip = async (
    data: createTipSchemaType
  ) => {
    const res = await createTips(data.content);
    if (res) {
      automatedForm.reset();
    }
  };

  const handleSendInstantTip = async (
    data: createTipSchemaType
  ) => {
    const res = await sendTestTip(data.content);
    if (res) {
      instantForm.reset();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ================= Automated Tips ================= */}
      <Card className="rounded shadow max-w-4xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Create Automated Tips</CardTitle>
          <CardDescription>
            Create a new tip in the RescueTap system that is posted
            at 7am and 4pm daily
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...automatedForm}>
            <form
              onSubmit={automatedForm.handleSubmit(
                handleCreateAutomatedTip
              )}
              className="space-y-6"
            >
              <ReusableFormField
                control={automatedForm.control}
                name="content"
                fieldType="textarea"
                className="h-20 text-sm rounded"
                placeholder="Stay hydrated. Learn more: https://example.com"
              />

              <CardFooter className="flex justify-end px-0">
                <Button
                  disabled={creatingTip}
                  type="submit"
                  className="rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3"
                >
                  {creatingTip ? "Processing..." : "Create Tip"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* ================= Instant Tips ================= */}
      <Card className="rounded shadow max-w-4xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Create Instant Tips</CardTitle>
          <CardDescription>
            Send an instant tip to the RescueTap system. This
            automatically notifies all organizations and users.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...instantForm}>
            <form
              onSubmit={instantForm.handleSubmit(
                handleSendInstantTip
              )}
              className="space-y-6"
            >
              <ReusableFormField
                control={instantForm.control}
                name="content"
                fieldType="textarea"
                className="h-20 text-sm rounded"
                placeholder="Emergency alert. Details: https://rescuetap.com"
              />

              <CardFooter className="flex justify-end px-0">
                <Button
                  disabled={sendingTestTip}
                  type="submit"
                  className="rounded bg-[#EF4136] hover:bg-[#EF4136]/50 text-white py-3"
                >
                  {sendingTestTip
                    ? "Processing..."
                    : "Send Test Tip"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateTips;
