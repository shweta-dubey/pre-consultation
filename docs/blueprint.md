# **App Name**: PreConsult AI

## Core Features:

- Agreement Prompt: Initial agreement question with 'Yes' and 'No' options. The system should navigate based on the user choice. It will proceed to gather demographic information upon a 'Yes' response or display a polite message upon a 'No' response.
- Demographic Collection: Collect the patient's name, date of birth, and gender through interactive form fields and manage this data using React state. Implement field validation, particularly for date of birth to ensure correct formatting.
- Medical Question Randomization and Response: Implement a tool that selects and displays five random questions from a set of ten medical-related questions. Utilize an LLM to ensure relevance to pre-consultation, manage the display sequence, capture user responses efficiently, and temporarily stores it via a state.
- Data Submission Simulation: Simulate an API call to send the collected patient details (name, DoB, gender) and their responses to the medical questions, and confirm successful data submission with a user-friendly confirmation message. Add Logging or Error handling for Mock API Calls.

## Style Guidelines:

- Primary color: Soft blue (#64B5F6) to evoke trust and calmness in the user.
- Background color: Light gray (#F5F5F5), nearly white, providing a clean and non-intrusive backdrop.
- Accent color: Teal (#4DB6AC), for interactive elements to stand out and suggest trustworthiness.
- Body font: 'Inter', sans-serif, modern.
- Headline font: 'Inter', sans-serif, modern. Note: currently only Google Fonts are supported.
- Use health-related icons from Material UI to represent various options or data points, providing a visual aid to the users.
- Follow a clean and structured layout using Material UI's Grid and Card components. Ensure elements are well-spaced and aligned for better readability.
- Incorporate subtle animations, like fading transitions when displaying questions, to keep users engaged without being distracting.