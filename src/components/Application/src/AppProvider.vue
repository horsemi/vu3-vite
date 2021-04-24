<script lang="ts">
import { defineComponent, ref, toRefs } from 'vue';
import { createBreakpointListen } from '/@/hooks/event/useBreakpoint';
import { createAppProviderContext } from './useAppContext';
import { prefixCls } from '/@/settings/designSetting';

export default defineComponent({
	name: 'AppProvider',
	inheritAttrs: false,  
	props: {
		prefixCls: {
			type: String,
			default: prefixCls
		}
	},
	setup(props, { slots }) {
		const isMobile = ref(false);

		createBreakpointListen(({ screenMap, sizeEnum, width }) => {
			const lgWidth = screenMap.get(sizeEnum.LG);
			if (lgWidth) {
				isMobile.value = width.value -1 < lgWidth;
			}
		});

		const { prefixCls } = toRefs(props);
		createAppProviderContext({ prefixCls, isMobile });
		return () => slots.default?.();
	},
});
</script>
