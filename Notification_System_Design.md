# Stage 1

## Approach: Priority Inbox for Campus Notifications

### Problem
Students receive high volume notifications and lose track of important ones. We need a Priority Inbox showing top 10 most important notifications.

### Priority Scoring Strategy

#### Type Weight (Primary Factor)
| Type | Weight |
|------|--------|
| Placement | 3 (Highest) |
| Result | 2 (Medium) |
| Event | 1 (Lowest) |

#### Recency (Tiebreaker)
Within same type, newer notifications rank higher using timestamp in milliseconds.

#### Score Formula
score = typeWeight * 1_000_000_000_000 + timestamp_in_milliseconds

### Maintaining Top N Efficiently
To handle new incoming notifications efficiently, a Min-Heap of size n is used:
- Insert new notification into heap
- If heap size exceeds n, remove the minimum (lowest priority)
- Always maintains top n notifications in O(log n) time

### Output
Top 10 notifications ranked by score showing Type, Message, Timestamp and Score.
