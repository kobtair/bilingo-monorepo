"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react"; // added spinner icon
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { getUserProgress, getLeaderboard } from "../api/progress";

type LeaderboardUser = {
  rank: number;
  name: string;
  points: number;
};

export default function ProgressPage() {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState({
    overallProgress: 33,
    completedLessons: [1],
    totalLessons: 3,
    score: 90,
    rank: 2,
  });
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const userEmail = JSON.parse(
          localStorage.getItem("user") || "{}"
        ).email;
        if (userEmail) {
          const data = await getUserProgress(userEmail);
          if (data) {
            setProgressData(data);
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setProgressLoading(false);
      }
    };

    // Call immediately then poll every 10 seconds for dynamic updates
    fetchProgress();
    const progressInterval = setInterval(fetchProgress, 10000);

    const fetchLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        if (data) {
          setLeaderboardData(data);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLeaderboardLoading(false);
      }
    };

    // Initial fetch for leaderboard (static)
    fetchLeaderboard();

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-blue-400">
      <div className="p-4 flex items-center">
        <Button
          variant="ghost"
          className="text-white p-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold text-white ml-4">Your Progress</h1>
      </div>

      <div className="flex-1 p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {progressLoading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
                <span>Loading progress...</span>
              </div>
            ) : (
              <>
                <Progress
                  value={progressData.overallProgress}
                  className="h-4 mb-2"
                />
                <p className="text-sm text-gray-500">
                  You've completed {progressData.overallProgress}% of the course
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              Leaderboard <span className="text-yellow-500 ml-2">🏆</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leaderboardLoading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
                <span>Loading leaderboard...</span>
              </div>
            ) : (
              <div className="space-y-1">
                {leaderboardData.map((user) => (
                  <div
                    key={user.rank}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      user.name.includes("(You)")
                        ? "bg-blue-600 text-white"
                        : user.rank === 1
                        ? "bg-blue-100"
                        : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="w-6 text-center">{user.rank}</span>
                      <span className="ml-4">{user.name}</span>
                    </div>
                    <span>{user.points}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
