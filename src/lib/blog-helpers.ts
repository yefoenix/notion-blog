export const getBlogLink = (slug: string) => {
  return `/note/${slug}`
}

export const getDateStr = date => {
  return new Date(date).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

export const postIsReady = (post: any) => {
  return process.env.NODE_ENV !== 'production' || post.Published === 'Yes'
}
