import { Record } from "../domain/record";
import { supabase } from "./supabaseClient";

export const getAllRecords = async (): Promise<Record[]> => {
  const { data, error } = await supabase
    .from("study-record")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching records:", error);
    return [];
  }
  return data;
};

export const addRecord = async (title: string, time: number) => {
  await supabase.from("study-record").insert({ title: title, time: time });
};

export const deleteRecord = async (id: number) => {
  await supabase.from("study-record").delete().eq("id", id);
};
