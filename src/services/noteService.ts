import axios from "axios";

const API = "https://thinkboard.codewithmmd.ir/api/notes";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content: string;
}

export const getNotes = async (): Promise<Note[]> => {
  const response = await axios.get(API);
  return response.data.response;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await axios.get(`${API}/${id}`);
  return response.data.response;
};

export const createNote = async (note: NoteInput) => {
  const response = await axios.post(API, note);
  return response.data;
};

export const updateNote = async (id: string, note: NoteInput) => {
  const response = await axios.put(`${API}/${id}`, note);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`);
  return response.data;
};
