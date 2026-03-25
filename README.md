# ResponSys - Crisis Coordination Platform

ResponSys is a high-fidelity, real-time tactical coordination platform designed for emergency NGOs, community crisis response networks, and rapid-response logistics teams. The platform bridges the gap between central dispatchers and field volunteers by tracking geographical incidents, computing nearest-responder metrics, and facilitating real-time operational communications.

---

## 👥 User Roles & Workflows

ResponSys utilizes a robust role-based access architecture with three distinct user categories:

### 1. Dispatcher (Admin)
The central command node of the platform.
*   **Capabilities**: Full oversight of the tactical map, ability to review incoming incident reports, and authority to dispatch volunteers to specific crises.
*   **Workflow**: Monitors the Live Operations Feed and Incident Queue. When a critical issue arises, the system automatically checks for the nearest available volunteers and ranks them by distance. The dispatcher assigns the task.

### 2. Volunteer
Active field responders who have opted-in by defining their specialized skills via their profile.
*   **Capabilities**: Can be dispatched by Admins to missions matching their skills. 
*   **Workflow**: Maintains availability and GPS location. Once assigned a task, they use the **My Tasks** dashboard to track mission details and mark resolutions.

### 3. Civilian / Bystander
Standard users who have registered but have not opted-in to field response (i.e., they have not selected any "Skills" in their profile).
*   **Capabilities**: Can actively submit crisis reports securely with GPS data. 
*   **Exclusion**: To prevent operational clutter, civilians and bystanders are **automatically excluded** from the active volunteer map and dispatch queues unless they explicitly update their profile with response skills.

---

## 🗺️ Core Features & Pages

### Authentication & Onboarding (`/auth`)
*   Provides secure, JWT-backed user authentication.
*   Routes users contextually based on their chosen role (Dispatchers route directly to the Map, normal users to the Dashboard).

### Tactical Map Hub (`/map`)
*   **Dynamic GIS Map**: Uses Leaflet and PostGIS GEOGRAPHY data to render high-performance, real-time map plots of incidents using customized, severity-colored smart pins.
*   **Incident Queue**: A live, scrollable feed of active reports overlaying the map.
*   **Intelligent Dispatching**: Clicking an incident instantly computes the Euclidean distance (Haversine formula applied) between the crisis point and every available volunteer, surfacing the nearest responders and their specific skills directly to the dispatcher.
*   **Live Operations Feed**: A real-time socket connection streams mission-critical updates and dispatcher logs instantly without requiring refreshes.
*   *Note: Dispatched volunteers automatically have their `is_available` status set to `busy / false` to ensure dispatch bandwidth isn't crossed.*

### Report Log (`/reports`)
*   A comprehensive tabular database view of all historical and active incidents.
*   **Advanced Filtering**: Sort and search by severity, status, keyword, or assignee.
*   **Data Export**: Built-in functionality for Admins to quickly export incident logs into `.csv` format for post-crisis reporting and data analysis.

### Submit Report (`/submit-report`)
*   A streamlined intake form available to all users (volunteers and civilians).
*   Allows users to pinpoint crisis location manually or via precision HTML5 Geolocation APIs.
*   Incident creators can flag the specific emergency severity and request tailored skills (e.g., Heavy Lifting, Medical Support).

### My Tasks (`/my-tasks`)
*   The personalized mission control for active Volunteers.
*   Displays all tasks explicitly assigned to them by central dispatch.
*   Allows the volunteer to append mission logs and formally "Resolve" the incident once field operations conclude.

### Nearby Discovery (`/nearby`)
*   A geographic visualization tool strictly for field agents.
*   Plots both active incidents and other volunteers in the nearby operational radius, helping field teams coordinate dynamically.

### Profile & Skills Management (`/my-profile`)
*   **Civilian to Volunteer Pathway**: Civilians can transition to Volunteers at any time by simply selecting skills (Medical, Tech Support, Logistics, etc.).
*   **Availability Toggle**: Field agents can toggle their availability on and off. If disabled, they instantly vanish from the active dispatcher queue.
*   **GPS Tracing**: Allows users to refresh their localized coordinates seamlessly into the Supabase PostGIS geospatial structure.

---

## 🚀 Technical Stack
*   **Frontend**: Next.js 15 (App Router), React 18, TailwindCSS.
*   **Geospatial / Mapping**: React-Leaflet, Leaflet.js Custom SVG Node rendering.
*   **Backend & DB**: Supabase, PostgreSQL / PostgREST.
*   **Geodata Storage**: PostGIS `GEOGRAPHY(POINT)` natively mapped and EWKB hex-decoded in client-side runtime for high security constraint environments.

---

*(Note: This README is continuously updated as new features are integrated into the ResponSys operational layer.)*
