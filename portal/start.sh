#!/bin/bash
# ============================================================
# NexPortal — Nuclie MFE Workspace Launcher
#
# HOW TO RUN (from your own terminal):
#   cd ~/Desktop/framework_practis/build
#   bash portal/start.sh
# ============================================================

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NUCLIE="$ROOT/dist/cli.js"

echo ""
echo "⚡ NexPortal — Micro Frontend Workspace"
echo "========================================"
echo "  🏠 Host App      → http://localhost:3010"
echo "  📋 Task Manager  → http://localhost:3011"
echo "  📈 Analytics     → http://localhost:3012"
echo "========================================"
echo ""

# Kill any stale processes on these ports
for PORT in 3010 3011 3012; do
  PID=$(lsof -ti tcp:$PORT 2>/dev/null)
  if [ -n "$PID" ]; then
    echo "⚠  Killing stale process on port $PORT (PID: $PID)"
    kill -9 $PID 2>/dev/null
  fi
done
sleep 0.5

echo "🚀 Starting all Micro Frontends concurrently..."
echo ""

# Start Task Manager remote (port 3011)
(cd "$ROOT/portal/tasks" && node --no-warnings "$NUCLIE" dev --port 3011) &
TASKS_PID=$!
echo "   ✓ [REMOTE] Task Manager   → http://localhost:3011  [PID $TASKS_PID]"

# Start Analytics remote (port 3012)
(cd "$ROOT/portal/analytics" && node --no-warnings "$NUCLIE" dev --port 3012) &
ANALYTICS_PID=$!
echo "   ✓ [REMOTE] Analytics      → http://localhost:3012  [PID $ANALYTICS_PID]"

# Small delay so remotes bind before host starts
sleep 1

# Start Host App (port 3010)
(cd "$ROOT/portal/host" && node --no-warnings "$NUCLIE" dev --port 3010) &
HOST_PID=$!
echo "   ✓ [HOST]   Host App       → http://localhost:3010  [PID $HOST_PID]"

echo ""
echo "✅ All 3 servers are running!"
echo "   👉 Open your browser: http://localhost:3010"
echo ""
echo "   Press Ctrl+C to stop all servers."
echo ""

# On Ctrl+C, kill all children
trap "echo ''; echo 'Stopping all servers...'; kill $TASKS_PID $ANALYTICS_PID $HOST_PID 2>/dev/null; exit 0" INT TERM

wait
