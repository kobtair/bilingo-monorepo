// Mock API functions for user progress

interface ProgressData {
  overallProgress: number
  completedLessons: number[]
  totalLessons: number
  score: number
  rank: number
}

// In-memory progress database for demo purposes
const userProgress: Record<string, ProgressData> = {
  "test@example.com": {
    overallProgress: 33,
    completedLessons: [1],
    totalLessons: 3,
    score: 90,
    rank: 2,
  },
}

export async function getUserProgress(email: string): Promise<ProgressData | null> {
  const backendUrl = import.meta.env.VITE_BACKEND_API;
  try {
    const response = await fetch(`${backendUrl}/progress?email=${encodeURIComponent(email)}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching progress:", error);
    return null;
  }
}

export async function updateProgress(email: string, lessonId: number): Promise<ProgressData> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Initialize user progress if it doesn't exist
  if (!userProgress[email]) {
    userProgress[email] = {
      overallProgress: 0,
      completedLessons: [],
      totalLessons: 3,
      score: 0,
      rank: 0,
    }
  }

  // Add lesson to completed lessons if not already completed
  if (!userProgress[email].completedLessons.includes(lessonId)) {
    userProgress[email].completedLessons.push(lessonId)

    // Update overall progress
    userProgress[email].overallProgress = Math.round(
      (userProgress[email].completedLessons.length / userProgress[email].totalLessons) * 100,
    )

    // Update score (in a real app, this would be more complex)
    userProgress[email].score += 10
  }

  return userProgress[email]
}

export async function getLeaderboard(): Promise<any> {
  const backendUrl = import.meta.env.VITE_BACKEND_API;
  try {
    const response = await fetch(`${backendUrl}/get-leaderboard`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return null;
  }
}

export async function completeChapter(email: string, lessonId: number): Promise<{ success: boolean }> {
  const backendUrl = import.meta.env.VITE_BACKEND_API;
  try {
    const response = await fetch(`${backendUrl}/chapter-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lessonId })
    });
    if (response.ok) {
      return { success: true };
    }
    console.error("Chapter completion failed:", response.statusText);
  } catch (error) {
    console.error("Error completing chapter:", error);
  }
  return { success: false };
}
