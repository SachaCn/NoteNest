<template>
  <div v-if="notes.length > 0">
    <p class="text-xs font-bold text-[#C2C2C5] mb-3">{{ title }}</p>
    <div class="flex flex-col mt-4 ml-4 gap-1">
      <template v-for="note in notes" :key="note.id">
        <div
          class="hover:bg-[#A1842C] rounded-lg cursor-pointer transition-all duration-300 py-2.5 pl-4 pr-6 group relative"
          :class="{
            'bg-[#A1842C]': selectedNote?.id === note.id,
            'hover:bg-[#A1842C]/50': selectedNote?.id !== note.id,
          }"
          @click="selectNote(note)"
        >
          <h3
            class="text-[#F4F4F5] font-bold text-sm overflow-ellipsis overflow-hidden w-[160px] whitespace-nowrap"
          >
            {{ note.text.slice(0, 30) }}
          </h3>
          <PencilIcon
            class="cursor-pointer text-[#000] p-1 ml-2 h-6 w-6 group-hover:text-[#F4F4F5] hover:text-[#FFAC00] transition-all duration-300 absolute right-[8px] top-[6px]"
            :class="{
              'text-[#F4F4F5]': selectedNote?.id === note.id,
            }"
            @click.stop="editNote(note)"
          />
          <div class="flex items-center gap-2">
            <span class="text-[#F4F4F5] mr-4 text-sm">{{
              new Date(note.updatedAt).toDateString() ===
              new Date().toDateString()
                ? "today"
                : new Date(note.updatedAt).toLocaleDateString()
            }}</span>
            <span
              class="text-[#C2C2C5] text-sm overflow-ellipsis overflow-hidden w-[128px] whitespace-nowrap"
            >
              {{ note.text.slice(0, 30) }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  notes: {
    type: Array,
    required: true,
  },
  selectedNote: {
    type: Object,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["selectNote", "editNote"]);

const selectNote = (note) => {
  emit("selectNote", note);
};
const editNote = (note) => {
  emit("editNote", note);
};
</script>
