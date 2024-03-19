<template>
  <v-card height="97%" width="100%" class="mt-7" elevation="0">
    <v-row justify="center">
      <v-card-title>
        <h2>Categorias</h2>
      </v-card-title>
    </v-row>
    <v-row justify="center">
      <v-col cols="10">
        <v-card elevation="7">

          <v-tooltip bottom color="primary">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="indigo darken-2" fab dark absolute top right v-bind="attrs" v-on="on"
                @click="dialogNewCategoria = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Adicionar nova categoria</span>
          </v-tooltip>

          <v-data-table hide-default-footer :headers="headers" class="elevation-1" :items="categorias">

            <template v-slot:[`item.color`]="{ item }">
              <v-chip :color="item.color">
              </v-chip>
            </template>

            <template v-slot:[`item.icon`]="{ item }">
              <v-icon :color="item.color">
                {{ item.icon }}
              </v-icon>
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-btn icon color="primary" @click="openDialogEdit(item)">
                <v-icon color="primary">
                  mdi-pencil
                </v-icon>
              </v-btn>

              <v-btn icon color="primary" @click="openDialogDelete(item)">
                <v-icon>
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogEditCategoria" width="500">
      <v-card>
        <v-row justify="center" class="pa-0 ma-0">
          <v-card-title>
            Editar Categoria
          </v-card-title>
        </v-row>
        <v-form ref="form" v-model="validEdit" lazy-validation>
          <v-row class="pa-0 ma-0">
            <v-col class="py-0 my-0" cols="6">
              <v-text-field label="Categoria" v-model="categoriaEdit.categoria" prepend-icon="mdi-shape-outline" required
                :rules="[v => !!v || 'Dê um nome a sua categoria!']">
              </v-text-field>
            </v-col>
            <v-col class="py-0 my-0" cols="6">
              <v-combobox v-model="categoriaEdit.icon" :items="icons" label="Selecione um ícone"
                :rules="[v => !!v || 'Selecione um icone para sua categoria!']" required>

                <template v-slot:item="{ item }">
                  <v-row justify="center">
                    <v-chip color="primary">
                      <v-icon>
                        {{ item }}
                      </v-icon>
                    </v-chip>
                  </v-row>
                </template>

                <template v-slot:selection="{ item }">
                  <v-chip small color="primary">
                    <v-icon>
                      {{ item }}
                    </v-icon>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>

            <v-col class="py-0 my-0 d-flex justify-center" cols="12">
              <v-color-picker v-model="color" mode="rgba" hide-inputs dot-size="25"
                swatches-max-height="200"></v-color-picker>
            </v-col>

            <v-col class="py-0 my-0 d-flex justify-center" cols="12">
              <v-chip large class="pa-4" :color="color !== undefined ? color.hex : ''" text-color="white">
                <v-icon color="white">
                  {{ categoriaEdit.icon }}
                </v-icon>
                <span class="ml-1"> {{ categoriaEdit.categoria }} </span>
              </v-chip>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-row dense>
            <v-col class="d-flex justify start">
              <v-btn color="blue darken-1" text @click="dialogEditCategoria = false">
                Voltar
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>

            <v-col class="d-flex justify-end">
              <v-btn color="blue darken-1" text @click="updateCategoria()" :disabled="!validEdit" :loading="loadingEdit">
                Salvar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDeleteCategoria" width="500">
      <v-card>
        <v-row class="pa-0 ma-0 error" justify="center">
          <v-card-title class="white--text">
            Deseja excluir essa categoria?
          </v-card-title>
        </v-row>
        <v-tooltip right color="warning">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mt-1" fab x-small elevation="0" absolute right color="warning" v-bind="attrs" v-on="on">
              <v-icon>
                mdi-exclamation-thick
              </v-icon>
            </v-btn>
          </template>
          <span>Nenhuma despesa (fixa ou avulsa) será afetada.</span>
        </v-tooltip>

        <v-row class="pa-0 ma-0">
          <v-col cols="12">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      Categoria
                    </th>
                    <th class="text-left">
                      Cor
                    </th>
                    <th class="text-left">
                      Icone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ categoriaDelete.categoria }}</td>
                    <td>
                      <v-chip :color="categoriaDelete.color"></v-chip>
                    </td>
                    <td>
                      <v-icon :color="categoriaDelete.color">
                        {{ categoriaDelete.icon }}
                      </v-icon>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-card-actions>
          <v-row dense>
            <v-col class="d-flex justify start">
              <v-btn color="blue darken-1" text @click="dialogDeleteCategoria = false">
                Cancelar
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>

            <v-col class="d-flex justify-end">
              <v-btn color="error" text @click="deleteCategoria()">
                Excluir
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogNewCategoria" width="500">
      <v-card>
        <v-row class="pa-0 ma-0" justify="center">
          <v-card-title>
            Nova categoria
          </v-card-title>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row class="pa-0 ma-0">
            <v-col class="py-0 my-0" cols="6">
              <v-text-field label="Categoria" v-model="newCategoria.categoria" prepend-icon="mdi-shape-outline" required
                :rules="[v => !!v || 'Dê um nome a sua categoria!']">
              </v-text-field>
            </v-col>
            <v-col class="py-0 my-0" cols="6">

              <v-combobox v-model="newCategoria.icon" :items="icons" label="Selecione um ícone"
                :rules="[v => !!v || 'Selecione um icone para sua categoria!']" required>

                <template v-slot:item="{ item }">
                  <v-row justify="center">
                    <v-chip color="primary">
                      <v-icon>
                        {{ item }}
                      </v-icon>
                    </v-chip>
                  </v-row>
                </template>

                <template v-slot:selection="{ item }">
                  <v-chip small color="primary">
                    <v-icon>
                      {{ item }}
                    </v-icon>
                  </v-chip>
                </template>
              </v-combobox>
            </v-col>

            <v-col class="py-0 my-0 d-flex justify-center mt-1" cols="12">
              <v-color-picker v-model="color" mode="rgba" hide-inputs dot-size="25"
                swatches-max-height="200"></v-color-picker>
            </v-col>

            <v-col class="py-0 my-0 d-flex justify-center" cols="12">
              <v-chip large class="pa-4" :color="color !== undefined ? color.hex : ''" text-color="white">
                <v-icon color="white">
                  {{ newCategoria.icon }}
                </v-icon>
                <span class="ml-1"> {{ newCategoria.categoria }} </span>
              </v-chip>
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-row dense>
            <v-col class="d-flex justify start">
              <v-btn color="blue darken-1" text @click="closeDialogNewCategoria">
                Voltar
              </v-btn>
            </v-col>

            <v-spacer></v-spacer>

            <v-col class="d-flex justify-end">
              <v-btn color="success" text @click="adicionarCategoria()" :disabled="!valid" :loading="loadingAdd">
                Adicionar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>

      </v-card>
    </v-dialog>


  </v-card>
</template>
  
<script>
export default {
  data() {
    return {
      dialogEditCategoria: false,
      dialogDeleteCategoria: false,
      dialogNewCategoria: false,
      loadingAdd: false,
      loadingEdit: false,
      categoriaEdit: {
        id: undefined,
        categoria: undefined,
        color: undefined,
        icon: undefined
      },
      categoriaDelete: {
        id: undefined,
        categoria: undefined,
        color: undefined,
        icon: undefined
      },
      newCategoria: {
        categoria: undefined,
        color: undefined,
        icon: undefined
      },
      color: undefined,
      valid: true,
      validEdit: true,
      icons: ['mdi-dumbbell', 'mdi-weight-lifter', 'mdi-food-variant', 'mdi-food', 'mdi-baguette', 'mdi-hamburger', 'mdi-noodles', 'mdi-food-apple', 'mdi-pasta', 'mdi-food-fork-drink', 'mdi-home-city', 'mdi-home-flood', 'mdi-greenhouse', 'mdi-gas-station', 'mdi-gas-station-outline', 'mdi-car', 'mdi-car-cog', 'mdi-car-wrench', 'mdi-water-pump', 'mdi-lightbulb-on', 'mdi-wifi', 'mdi-web', 'mdi-netflix', 'mdi-youtube-tv', 'mdi-spotify', 'mdi-apple', 'mdi-party-popper', 'mdi-cake', 'mdi-bus-stop', 'mdi-taxi', 'mdi-paw', 'mdi-soccer', 'mdi-gamepad', 'mdi-gamepad-variant', 'mdi-beer', 'mdi-glass-wine', 'mdi-smoking', 'mdi-airplane', 'mdi-credit-card', 'mdi-hanger', 'mdi-golf', 'mdi-cat', 'mdi-dog-side'],
      headers: [
        {
          text: 'Categoria',
          align: 'start',
          value: 'categoria',
        },
        { text: 'Cor', value: 'color', sortable: false },
        { text: 'Ícone', value: 'icon', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
    }
  },
  methods: {
    openDialogEdit(item) {
      this.dialogEditCategoria = true
      this.categoriaEdit = { ...item }
    },
    openDialogDelete(item) {
      this.dialogDeleteCategoria = true
      this.categoriaDelete = { ...item }
    },
    updateCategoria() {
      new Promise((resolve) => {
        this.$refs.form.validate()
        resolve()
      }).then(() => {
        if (this.validEdit == true) {
          this.loadingEdit = true
          this.categoriaEdit.color = this.color.hex
          this.$store.dispatch('updateCategorias', this.categoriaEdit).then(() => {
            this.dialogEditCategoria = false
            this.loadingEdit = false
            this.$store.commit('changeAlert', {
              state: true,
              type: 'success',
              message: 'Categoria editada com sucesso!'
            })
          })          
        }
      })

    },
    deleteCategoria() {
      this.$store.dispatch('deleteCategoria', this.categoriaDelete.id)
      this.dialogDeleteCategoria = false
    },
    adicionarCategoria() {
      new Promise((resolve) => {
        this.$refs.form.validate()
        resolve()
      }).then(() => {
        if (this.valid == true) {
          this.loadingAdd = true
          this.newCategoria.id_usuario = this.usuario.id
          this.newCategoria.color = this.color.hex
          this.$store.dispatch('newCategoria', this.newCategoria).then(() => {
            this.dialogNewCategoria = false
            this.loadingAdd = false
            this.$store.commit('changeAlert', {
              state: true,
              type: 'success',
              message: 'Categoria adicionada com sucesso!'
            })
            this.newCategoria = {
              categoria: undefined,
              color: undefined,
              icon: undefined
            }
          })
        }
      })
    },
    closeDialogNewCategoria() {
      this.newCategoria = {
        id: undefined,
        categoria: undefined,
        color: undefined,
        icon: undefined
      }
      this.$refs.form.resetValidation()
      this.dialogNewCategoria = false
    }
  },

}
</script>
  
<style></style>