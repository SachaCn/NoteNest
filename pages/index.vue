<template>
  <div class="flex bg-zinc-900 h-screen">
    <!-- sidebar -->
    <div class="bg-black w-[320px] min-w-[320px] p-8">
      <div class="flex items-center justify-between mb-12">
        <Logo />
        <button
          class="text-[#C2C2C5] text-sm font-bold cursor-pointer hover:text-white transition-all hover:bg-[#F4F4F5]/50 duration-300 px-3 py-1 rounded-md"
          @click="logout"
        >
          Logout
        </button>
      </div>
      <div class="overflow-y-auto h-[calc(100vh-150px)] pr-2">
        <NoteWrapper
          :notes="todaysNotes"
          :selectedNote="selectedNote"
          title="Today"
          @selectNote="handleSelectNote"
          @editNote="handleEditNote"
        />
        <NoteWrapper
          :notes="yesterdayNotes"
          :selectedNote="selectedNote"
          title="Yesterday"
          @selectNote="handleSelectNote"
          @editNote="handleEditNote"
        />
        <NoteWrapper
          :notes="earlierNotes"
          :selectedNote="selectedNote"
          title="Earlier"
          @selectNote="handleSelectNote"
          @editNote="handleEditNote"
        />
      </div>
    </div>
    <!-- /sidebar -->
    <!-- note container -->
    <div
      class="bg-zinc-900 pt-12 pl-6 pr-12 w-full h-full flex flex-col items-center"
    >
      <div class="flex items-center justify-between w-full">
        <button
          class="inline-flex items-center gap-2 cursor-pointer group hover:text-white transition-all duration-300"
          @click="createNote"
        >
          <PencilIcon class="text-[#C2C2C5] group-hover:text-white" />
          <p class="text-[#C2C2C5] font-bold text-sm hover:text-white">
            Create Note
          </p>
        </button>
        <TrashIcon
          v-if="selectedNote.id"
          class="cursor-pointer text-[#C2C2C5] hover:text-white"
          @click="deleteNote"
        />
      </div>
      <div v-if="idEditing" class="w-full h-[calc(50vh-100px)] mt-12">
        <textarea
          v-model="newNote"
          class="w-full h-full bg-zinc-900 text-[#D4D4D4] p-8 border-[#27272A] border-2 rounded-md"
          placeholder="Write your note here..."
        ></textarea>
        <div class="flex items-center justify-between">
          <button
            class="text-[#C2C2C5] text-sm font-bold cursor-pointer hover:text-white transition-all hover:bg-[#F4F4F5]/50 duration-300 px-3 py-1 rounded-md"
            @click="idEditing = false"
          >
            Cancel
          </button>
          <button
            class="text-[#C2C2C5] text-sm font-bold cursor-pointer hover:text-white transition-all hover:bg-[#F4F4F5]/50 duration-300 px-3 py-1 rounded-md"
            @click="saveNote"
          >
            Save
          </button>
        </div>
      </div>
      <template v-else>
        <div
          v-if="selectedNote.id"
          class="text-[16px] text-[#D4D4D4] max-w-[450px] my-auto space-y-6 font-playfair"
        >
          <p class="text-[#929292]">
            {{ new Date(selectedNote.updatedAt).toLocaleDateString() }}
          </p>
          <p class="leading-6">
            {{ selectedNote.text }}
          </p>
        </div>
        <div v-else class="max-w-[450px] my-auto space-y-6">
          <p class="text-[#C2C2C5]">Select a note or create a new one</p>
        </div>
      </template>
    </div>
    <!-- /note container -->
  </div>
</template>

<script setup>
import NoteWrapper from "~/components/NoteWrapper.vue";
import Swal from "sweetalert2";

definePageMeta({
  middleware: ["auth"],
});

const notes = ref([]);
const selectedNote = ref({});

const idEditing = ref(false);
// create, edit
const editMode = ref("create");
const newNote = ref("");
const createNote = () => {
  newNote.value = "";
  selectedNote.value = {};
  idEditing.value = true;
  editMode.value = "create";
};
const saveNote = async () => {
  if (editMode.value === "create") {
    try {
      const response = await $fetch("/api/notes", {
        method: "POST",
        body: {
          text: newNote.value,
        },
      });
      newNote.value = "";
      idEditing.value = false;
      notes.value = [...notes.value, response];
      selectedNote.value = response;
    } catch (error) {
      console.log(error.response?._data?.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?._data?.message,
      });
    }
  } else if (editMode.value === "edit") {
    try {
      const response = await $fetch(`/api/notes/${selectedNote.value.id}`, {
        method: "PATCH",
        body: {
          text: newNote.value,
        },
      });
      newNote.value = "";
      idEditing.value = false;
      notes.value = notes.value.map((note) =>
        note.id === response.id ? response : note
      );
      selectedNote.value = response;
    } catch (error) {
      console.log(error.response?._data?.message);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?._data?.message,
      });
    }
  }
};
const deleteNote = async () => {
  try {
    if (!selectedNote.value.id) return;
    const response = await $fetch(`/api/notes/${selectedNote.value.id}`, {
      method: "DELETE",
    });
    notes.value = notes.value.filter((note) => note.id !== response.id);
    selectedNote.value = notes.value[0];
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.response?._data?.message,
    });
  }
};

const todaysNotes = computed(() => {
  return notes.value.filter((note) => {
    const noteDate = new Date(note.updatedAt);
    const today = new Date();
    return noteDate.toDateString() === today.toDateString();
  });
});
const yesterdayNotes = computed(() => {
  return notes.value.filter((note) => {
    const noteDate = new Date(note.updatedAt);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return noteDate.toDateString() === yesterday.toDateString();
  });
});
const earlierNotes = computed(() => {
  return notes.value.filter((note) => {
    const noteDate = new Date(note.updatedAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      noteDate.toDateString() !== today.toDateString() &&
      noteDate.toDateString() !== yesterday.toDateString()
    );
  });
});

const handleSelectNote = (note) => {
  idEditing.value = false;
  selectedNote.value = note;
};
const handleEditNote = (note) => {
  editMode.value = "edit";
  idEditing.value = true;
  newNote.value = note.text;
  selectedNote.value = note;
};

const logout = () => {
  const jwt = useCookie("NoteNestJWT");
  jwt.value = null;
  navigateTo("/login");
};
watch(notes, () => {
  notes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
});
onMounted(async () => {
  const response = await $fetch("/api/notes");
  notes.value = response;
  notes.value.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  if (notes.value.length > 0) {
    selectedNote.value = notes.value[0];
  }
});
</script>
