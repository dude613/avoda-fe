"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import usePermission from "@/hooks/usePermission";
import { TASK_PERMISSIONS } from "@/constants/Permissions";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface TaskCommentsProps {
  taskId: string;
}

export default function TaskComments({ taskId }: TaskCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Permission check
  const { allowed: canAddComment } = usePermission(
    TASK_PERMISSIONS.UPDATE_TASK
  );

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Mock data for now, i'd replace with actual api call later
        const mockComments: Comment[] = [
          {
            id: "1",
            content: "We should prioritize this task for the upcoming sprint.",
            createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            user: {
              id: "1",
              name: "John Doe",
              avatar: undefined,
            },
          },
          {
            id: "2",
            content:
              "I've started working on this. Will update once I make progress.",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            user: {
              id: "2",
              name: "Jane Smith",
              avatar: undefined,
            },
          },
        ];

        setComments(mockComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      // Mock data for now, i'd replace with actual api call later
      const mockComment: Comment = {
        id: `new-${Date.now()}`,
        content: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: "current-user",
          name: "Current User",
          avatar: undefined,
        },
      };

      setComments((prev) => [...prev, mockComment]);
      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    try {
      // await fetch(`/api/tasks/${taskId}/comments/${commentId}`, {
      //   method: 'DELETE'
      // });

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  // Format date
  const formatCommentDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div>
      <h3 className="flex items-center mb-4 text-lg font-medium">
        <MessageSquare className="w-5 h-5 mr-2" />
        Comments
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-b-2 rounded-full animate-spin border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="p-4 text-center rounded-md bg-muted/30">
              <p className="text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-md bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <div className="flex items-center justify-center w-full h-full text-sm font-medium bg-primary text-primary-foreground">
                          {comment.user.name.charAt(0).toUpperCase()}
                        </div>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatCommentDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    {comment.user.id === "current-user" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {canAddComment && (
            <div className="mt-6">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px] mb-2"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submitting}
                  className="flex items-center gap-1"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
