<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}__field`">
      <div :class="`${prefixCls}__field__title`">字段</div>
      <div
        v-for="(item, index) in fieldList"
        :key="index"
        :class="[`${prefixCls}__field__item`, item.checked && `${prefixCls}__field__item--active`]"
        @click="item.checked = !item.checked"
      >
        <div @click.stop="">
          <DxCheckBox v-model:value="item.checked" @valueChanged="onFieldList" />
        </div>
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div :class="`${prefixCls}__next`">
      <i class="dx-icon-chevronnext" />
    </div>
    <div :class="`${prefixCls}__table`">
      <DxDataGrid
        height="100%"
        :data-source="dataSource"
        :show-borders="true"
        :show-column-lines="false"
        :show-row-lines="true"
      >
        <DxEditing :allow-updating="true" mode="cell" />
        <DxPaging :enabled="false" />
        <DxColumn caption="序号" cell-template="index" />
        <DxColumn data-field="FirstName" caption="字段" />
        <DxColumn data-field="LastName" caption="排序方式" />
        <DxColumn caption="操作" cell-template="handle" />
        <template #index="{ data }"> {{ data.rowIndex + 1 }} </template>
        <template #handle>
          <div>
            <span>上移</span>
            <span>下移</span>
            <span>删除</span>
          </div>
        </template>
      </DxDataGrid>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxCheckBox } from 'devextreme-vue/check-box';
import { DxDataGrid, DxColumn, DxPaging, DxEditing } from 'devextreme-vue/data-grid';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

export default defineComponent({
  components: {
    DxCheckBox,
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
  },
  setup() {
    const { prefixCls } = useDesign('content-sort');

    const fieldList = reactive([
      {
        text: '单据头-单据日期',
        checked: false,
      },
      {
        text: '单据头-创建人',
        checked: false,
      },
      {
        text: '单据头-单据状态',
        checked: false,
      },
      {
        text: '单据头-业务状态',
        checked: false,
      },
      {
        text: '单据头-运费金额汇总',
        checked: false,
      },
      {
        text: '单据头-创建人',
        checked: false,
      },
      {
        text: '单据头-修改日期',
        checked: false,
      },
      {
        text: '单据头-作废状态',
        checked: false,
      },
      {
        text: '单据头-作废人',
        checked: false,
      },
      {
        text: '单据头-总包件数',
        checked: false,
      },
    ]);

    const employees = [
      {
        ID: 1,
        FirstName: 'John',
        LastName: 'Heart',
        Prefix: 'Mr.',
        Position: 'CEO',
        BirthDate: '1964/03/16',
        HireDate: '1995/01/15',
        Notes:
          'John has been in the Audio/Video industry since 1990. He has led DevAv as its CEO since 2003.\r\n\r\nWhen not working hard as the CEO, John loves to golf and bowl. He once bowled a perfect game of 300.',
        Address: '351 S Hill St.',
        StateID: 5,
      },
      {
        ID: 2,
        FirstName: 'Olivia',
        LastName: 'Peyton',
        Prefix: 'Mrs.',
        Position: 'Sales Assistant',
        BirthDate: '1981/06/03',
        HireDate: '2012/05/14',
        Notes:
          'Olivia loves to sell. She has been selling DevAV products since 2012. \r\n\r\nOlivia was homecoming queen in high school. She is expecting her first child in 6 months. Good Luck Olivia.',
        Address: '807 W Paseo Del Mar',
        StateID: 5,
      },
      {
        ID: 3,
        FirstName: 'Robert',
        LastName: 'Reagan',
        Prefix: 'Mr.',
        Position: 'CMO',
        BirthDate: '1974/09/07',
        HireDate: '2002/11/08',
        Notes:
          'Robert was recently voted the CMO of the year by CMO Magazine. He is a proud member of the DevAV Management Team.\r\n\r\nRobert is a championship BBQ chef, so when you get the chance ask him for his secret recipe.',
        Address: '4 Westmoreland Pl.',
        StateID: 4,
      },
      {
        ID: 4,
        FirstName: 'Greta',
        LastName: 'Sims',
        Prefix: 'Ms.',
        Position: 'HR Manager',
        BirthDate: '1977/11/22',
        HireDate: '1998/04/23',
        Address: '1700 S Grandview Dr.',
        StateID: 11,
      },
    ];

    const dataSource = new DataSource({
      store: new ArrayStore({
        data: employees,
        key: 'ID',
      }),
    });

    const onFieldList = () => {
      console.log(fieldList);
    };

    return {
      prefixCls,
      fieldList,
      dataSource,
      onFieldList,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-content-sort';

.@{prefix-cls} {
  display: flex;
  align-items: center;
  height: 100%;

  &__field {
    width: 30%;
    height: 100%;
    border: 1px solid #e4e7ed;
  }

  &__field__title {
    height: 33px;
    padding-left: 20px;
    font-weight: bold;
    line-height: 33px;
    background-color: #fafafa;
    border-bottom: 1px solid #e4e7ed;
  }

  &__field__item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    cursor: pointer;
    span {
      padding-left: 10px;
    }
    &--active {
      background-color: #e6f7ff;
    }
  }

  &__next {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 40px;
    margin: 0 10px;
    color: #fff;
    cursor: pointer;
    background-color: #0486fe;
    border-radius: 2px;
    &:hover {
      background: rgba(4, 134, 254, 0.7);
    }
  }

  &__table {
    flex: 1;
    height: 100%;
    span {
      margin-right: 20px;
      color: @color-primary;
      cursor: pointer;
    }
  }
}
</style>
