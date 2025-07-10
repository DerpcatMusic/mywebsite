export interface Release {
  id: string
  title: string
  image: string
  streamLink: string
  releaseDate: string
}

// Current featured release - easily swap this out for new releases
export const currentRelease: Release = {
  id: "latest-single-2025",
  title: "Demon Cake",
  image: "/release.png?height=600&width=1200", // Replace with your actual image URL
  streamLink: "https://www.submithub.com/link/derpcat-and-pvthos-demon-cake", // Replace with your actual stream link
  releaseDate: "2024-01-15",
}

// Archive of previous releases
export const previousReleases: Release[] = [
  {
    id: "previous-track-1",
    title: "Previous Hit",
    image: "/placeholder.svg?height=600&width=1200",
    streamLink: "https://open.spotify.com/track/previous-track-id",
    releaseDate: "2023-12-01",
  },
  // Add more previous releases here
]
