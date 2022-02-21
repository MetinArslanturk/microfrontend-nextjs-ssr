export default async function handler(req: any, res: any) {
  
    try {
      await res.unstable_revalidate('/')
      return res.json({ revalidated: true })
    } catch (err) {
      // If there was an error, Next.js will continue
      // to show the last successfully generated page
      console.log(err);
      
      return res.status(500).send('Error revalidating')
    }
  }