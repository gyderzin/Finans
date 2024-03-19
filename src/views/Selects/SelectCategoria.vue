<template>
    <v-select v-model="value" :items="items" :label="label" multiple dense prepend-icon="mdi-shape-outline">
        <template v-slot:selection="{ item, index }">
            <v-chip v-if="index === 0">
                <span>{{ item }}</span>
            </v-chip>
            <v-chip v-if="index === 1">
                <span>{{ item }}</span>
            </v-chip>
            <span v-if="index === 2" class="grey--text text-caption">
                (+{{ value.length - 2 }} outros)
            </span>
        </template>
    </v-select>

</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true
        },
        label: {
            type: String,
            required: true
        },
        changeCategoria: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            value: []
        }
    },
    watch: {
        value(newVal) {
            this.changeCategoria(newVal)
        }
    }
}
</script>

<style>

</style>