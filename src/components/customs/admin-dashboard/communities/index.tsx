"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateCommunityMutation, useGetCommunitiesQuery } from "@/redux/features/communities-api"
import { RootState } from "@/lib/store"
import { Plus } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "sonner"

export default function Communities() {
  const { user } = useSelector((state: RootState) => state.auth)
  const userId = user?._id as string | undefined
  const { data: communities = [], isLoading } = useGetCommunitiesQuery(userId!, { skip: !userId })
  const [createCommunity, { isLoading: isCreating }] = useCreateCommunityMutation()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userId || !name.trim()) return
    try {
      await createCommunity({
        name: name.trim(),
        description: description.trim() || undefined,
        createdBy: userId,
      }).unwrap()
      setName("")
      setDescription("")
      toast.success("Community created")
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to create community")
    }
  }

  return (
    <section className="space-y-6">
      <Card className="rounded-sm shadow">
        <CardHeader>
          <CardTitle>Create Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <label className="grid gap-2 text-sm font-medium">
              Name
              <Input value={name} onChange={(event) => setName(event.target.value)} required maxLength={100} />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              Description
              <Textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength={500} className="min-h-10" />
            </label>
            <Button type="submit" disabled={isCreating || !userId} className="bg-[#EF4136] hover:bg-[#EF4136]/90">
              <Plus />
              {isCreating ? "Creating" : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-sm shadow">
        <CardHeader><CardTitle>Communities</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <p className="text-sm text-muted-foreground">Loading communities...</p> : (
            <div className="divide-y">
              {communities.map((community) => (
                <div key={community._id} className="flex items-center justify-between gap-4 py-4">
                  <div><p className="font-medium">{community.name}</p><p className="text-sm text-muted-foreground">{community.description || "No description"}</p></div>
                  <span className="text-sm text-muted-foreground">{community.members?.length || 0} members</span>
                </div>
              ))}
              {!communities.length && <p className="py-4 text-sm text-muted-foreground">No communities yet.</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}