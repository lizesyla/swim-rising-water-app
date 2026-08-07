import heapq

def solve_swim_in_water(grid):
    n = len(grid)
    min_heap = [(grid[0][0], 0, 0)]
    
    visited = set([(0, 0)])
    parent = {(0, 0): None}
    
    steps_log = []
    
    steps_log.append({
        "row": 0, 
        "col": 0, 
        "time": grid[0][0], 
        "status": "visiting"
    })

    while min_heap:
        time, r, c = heapq.heappop(min_heap)
        
        steps_log.append({
            "row": r, 
            "col": c, 
            "time": time, 
            "status": "visited"
        })
        
        if r == n - 1 and c == n - 1:
            path = []
            current = (r, c)
            while current is not None:
                path.append({"row": current[0], "col": current[1]})
                current = parent[current]
            path.reverse()
            return {
                "max_time": time,
                "steps": steps_log,
                "path": path
            }
            
        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            
            if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in visited:
                visited.add((nr, nc))
                parent[(nr, nc)] = (r, c)
                
                next_time = max(time, grid[nr][nc])
                heapq.heappush(min_heap, (next_time, nr, nc))
                
                steps_log.append({
                    "row": nr, 
                    "col": nc, 
                    "time": next_time, 
                    "status": "queued"
                })

    return {"max_time": -1, "steps": steps_log, "path": []}
