
export function normalizeReplies(posts: any[]): any[] {
    return posts.map((post) => ({
      ...post,
      data: {
        ...post.data,
        comments: post.data.comments.map((comment: any) => ({
          ...comment,
          data: {
            ...comment.data,
            replies: (comment.data.replies ?? []).map((reply: any) => ({
              ...reply,
              data: {
                ...reply.data,
                replies: reply.data.replies ?? [],
              },
            })),
          },
        })),
      },
    }));
  }