# Dog Catalogue

A Vue and Node.js application for managing dog breeds and sub-breeds. Data is stored in MongoDB.

Live application: [https://dog-catalogue.onrender.com](https://dog-catalogue.onrender.com)

## Features

- Create, view, edit, and delete breeds
- Search breeds and sub-breeds
- Pagination and sorting
- Light and dark themes
- Input validation and duplicate-name protection
- Streaming JSON importer for large input files

## Technology

- Vue 3 and Vite
- Node.js and Express
- MongoDB and Mongoose

## Local setup

Requirements:

- Node.js 20 or newer
- npm
- A local or hosted MongoDB database

Install dependencies:

```bash
npm install
npm run install:all
```

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Set the values in `backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/dog-catalogue
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Import `dogs.json`:

```bash
npm run seed
```

Start the frontend and backend:

```bash
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- API: `http://localhost:4000/api`
- Readiness check: `http://localhost:4000/api/health` (returns `503` when MongoDB is unavailable)

## Use the application

- Use the search field to find a breed or sub-breed.
- Use the sort menu to order the results.
- Use the page controls and page-size menu to move through the results.
- Select **Add breed** to create a breed and optionally add comma-separated sub-breeds.
- Use the edit button on a breed card to change it.
- Use the delete button on a breed card to remove it.
- Use the theme button to switch between light and dark mode.

## Import another JSON file

```bash
npm run seed --prefix backend -- /absolute/path/to/file.json
```

Expected format:

```json
{
  "retriever": ["golden", "curly"],
  "pug": []
}
```

The importer updates existing breeds and creates missing breeds. It does not delete breeds that are missing from the input file.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/dogs` | List dogs |
| `GET` | `/api/dogs/:id` | Get one dog |
| `POST` | `/api/dogs` | Create a dog |
| `PUT` | `/api/dogs/:id` | Update a dog |
| `DELETE` | `/api/dogs/:id` | Delete a dog |

List parameters:

- `search`: breed or sub-breed prefix
- `page`: page number
- `limit`: results per page, maximum 100
- `sort`: `name`, `newest`, or `updated`

Page-based access is bounded to a 10,000-record result window to avoid expensive database skips.

Example:

```bash
curl "http://localhost:4000/api/dogs?search=gold&page=1&limit=12&sort=name"
```

Create or update body:

```json
{
  "name": "retriever",
  "subBreeds": ["golden", "curly"]
}
```

## Test and build

```bash
npm test
npm run build
```

The application does not currently include authentication. Anyone with the public URL can change the data.
