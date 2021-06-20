<template>
  <div :class="prefixCls">
    <DxDataGrid
      :data-source="dataSource"
      :show-borders="false"
      :show-column-lines="false"
      :show-row-lines="true"
    >
      <DxEditing :allow-updating="true" mode="cell" />
      <DxPaging :enabled="false" />
      <DxColumn data-field="Prefix" caption="字段" />
      <DxColumn data-field="FirstName" caption="比较" />
      <DxColumn data-field="LastName" caption="值" />
      <DxColumn data-field="Position" caption="逻辑" />
      <DxColumn caption="操作" cell-template="handle" />
      <template #handle="{ data }">
        <div>
          <span @click="onUpAdd(data.rowIndex)">上加</span>
          <span @click="onDownAdd(data.rowIndex)">下加</span>
          <span @click="onDel(data.rowIndex)">删除</span>
        </div>
      </template>
    </DxDataGrid>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { DxDataGrid, DxColumn, DxPaging, DxEditing } from 'devextreme-vue/data-grid';

export default defineComponent({
  components: {
    DxDataGrid,
    DxColumn,
    DxPaging,
    DxEditing,
  },
  setup() {
    const { prefixCls } = useDesign('content-requirement');
    let dataSource = reactive([
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
    ]);

    const onUpAdd = (index) => {
      dataSource.push({
        ID: 1,
        FirstName: '',
        LastName: '',
        Prefix: '.',
        Position: '',
        BirthDate: '',
        HireDate: '',
        Address: '',
        StateID: 1,
      });
      console.log(dataSource, index);
    };
    const onDownAdd = (index) => {
      console.log(index);
    };
    const onDel = (index) => {
      console.log(index);
    };

    return {
      dataSource,
      prefixCls,
      onUpAdd,
      onDownAdd,
      onDel,
    };
  },
});
</script>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-content-requirement';

.@{prefix-cls} {
  height: 100%;
  span {
    margin-right: 20px;
    color: @color-primary;
    cursor: pointer;
  }
}
</style>

