<template>
  <q-page>
    <div class="q-pa-md">
      <q-list
        bordered
        separator
      >
        <q-slide-item 
          v-for="transacao in transacoes"
          :key="transacao.id"
          @right="onTransacaoSlidePraDireita($event, transacao)" 
          left-color="positive"
          right-color="negative"
        >
          <template v-slot:right>
            <q-icon name="delete" />
          </template>
            <q-item>
              <q-item-section
                class="text-weight-bold"
                :class="useValorCorClass(transacao.valor)"
              >  
                {{ transacao.descricao }}
              </q-item-section>

              <q-item-section
                class="text-weight-bold"
                :class="useValorCorClass(transacao.valor)"
                side>
                {{ useFormataValor(transacao.valor) }}
              </q-item-section>
            </q-item>
        </q-slide-item>
      </q-list>
    </div>

    <q-footer
      class="bg-transparent"
    >
      <div class="row q-mb-sm q-px-md q-py-sm shadow-up-3">
        <div class="col text-grey-7 text-h6">
          Saldo
        </div>
        <div 
          :class="useValorCorClass(saldo)"
          class="col text-h6 text-right"
        >
          {{ useFormataValor(saldo) }}
        </div>
      </div>
      <q-form 
        @submit="addTransacao"
        class="row q-px-sm q-pb-sm q-col-gutter-sm bg-primary items-center"
      >
        <div class="col">
          <q-input 
            v-model="addTransacaoForm.descricao"
            ref="descricaoRef"
            placeholder="Descrição"
            bg-color="white"
            outlined
            dense
           />
        </div>
        <div class="col">
          <q-select
            outlined
            v-model="addTransacaoForm.tipo"
            :options="tiposTransacoes"
            option-label="nome"
            option-value="value"
            placeholder="Tipo"
            map-options
            bg-color="white"
            dense
          />
        </div>
        <div class="col">
          <q-input 
            v-model.number="addTransacaoForm.valor"
            input-class="text-right"
            placeholder="Valor"
            bg-color="white"
            type="number"
            step="0.01"
            outlined
            dense
           />
        </div>
        <div class="col">
          <q-input 
            v-model="addTransacaoForm.data" 
            placeholder="Data"
            mask="date" 
            :rules="['date']"
            bg-color="white" 
            outlined
            dense
            style="padding-bottom: 0;"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="addTransacaoForm.data">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fechar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col">
          <q-btn
            round 
            color="primary"
            icon="add" 
            type="submit"
          />
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script setup>

  import { ref, computed, reactive, onMounted } from 'vue'
  import { uid, useQuasar  } from 'quasar'
  import { useFormataValor }  from 'src/use/useFormataValor'
  import { useValorCorClass }  from 'src/use/useValorCorClass'
  import api from '../stores/api.js'

  const $q = useQuasar()
  
  onMounted(() => {
    carregaTransacoes()
  })

  const transacoes = ref ([]),
    tiposTransacoes = ([{nome: 'Despesa', value: 0}, {nome: 'Receita', value: 1} ])

  async function carregaTransacoes() {
      try {
        const response = await api.get('transacoes');
        transacoes.value = response.data || []
      } catch (error) {
        $q.notify({
          message: 'Erro ao carregar transações',
          color: 'negative'
        });
      }
    }

  const saldo = computed(() => {
    return transacoes.value.reduce((saldo, { valor }) => {
      return saldo + valor
    }, 0)
  })

  const descricaoRef = ref(null)

  const addTransacaoFormPadrao = {
    descricao: '',
    valor: null,
    tipo: 0,
    data: null
  }

  const addTransacaoForm = reactive({
    ...addTransacaoFormPadrao
  })

  const addTransacaoFormReseta= () => {
    Object.assign(addTransacaoForm, addTransacaoFormPadrao)
    descricaoRef.value.focus()
  }


  const addTransacao = async () => {
    try {
      const dataFormatada = addTransacaoForm.data ? 
        addTransacaoForm.data.replace(/\//g, '-') : 
        null;
      
      const payload = {
        ...addTransacaoForm,
        id: uid(),
        ativo: true,
        tipo: addTransacaoForm.tipo.value,
        data: dataFormatada
      };
      
      const response = await api.post('/transacoes', payload);
      addTransacaoFormReseta();
      await carregaTransacoes();
    } catch (error) {
      console.error('Erro ao adicionar transação:', error)
      $q.notify({
        message: 'Erro ao adicionar transação',
        color: 'negative'
      });
    }
  }


  const onTransacaoSlidePraDireita = ({ reset }, transacao) => {
    $q.dialog({
      title: 'Deleta Transação',
      message: `
        Deseja deletar está transação?
        <div class="q-mt-md text-weight-bold ${ useValorCorClass(transacao.valor) }">
        ${ transacao.descricao }: ${ useFormataValor(transacao.valor) }
        </div>
      `,
      cancel: true,
      persistent: true,
      html: true,
      ok: {
        label: 'Deletar',
        color: 'negative',
        noCaps: true
      },
      cancel: {
        label: 'Cancelar',
        color: 'primary',
        noCaps: true
      }
    }).onOk(() => {
      deletaTransacao(transacao.id)
    }).onCancel(() => {
      reset()
    })
  }

  const deletaTransacao = async(transacaoId) => {
    try {
      const response = await api.delete(`/transacoes/${transacaoId}`)
      $q.notify({
        message: 'Transação deletada!',
        position: 'top'
      })
      await carregaTransacoes()
    }
    catch(error){
      $q.notify({
          message: 'Erro ao carregar transações',
          color: 'negative'
        });
    }
  }

</script>
