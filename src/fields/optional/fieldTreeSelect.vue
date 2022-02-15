<template id="dd">
	<treeselect
		v-model="value"
		:options="options"
		:disabled="schema.disabled"
		:disable-branch-nodes="true"
		:searchable="true"
		:show-count="false"
		:close-on-select="selectOptions.closeOnSelect"
		:always-open="false"
		:clearable="true"
		:open-on-focus="false"
		:clear-on-select="false"
		:append-to-body="false"
		:multiple="false"
		:disableFuzzyMatching="true"
		search-nested
	>
		<label
			slot="option-label"
			slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
			:class="labelClassName"
		>
			<div v-on:click="labelOnClick(node, selectOptions.type,selectOptions.closeOnLabelClick, node.isBranch)">
				{{ node.label }}
			</div>
			<span v-on:click="iconOnClick(node, selectOptions.type)" v-if="selectOptions.showInfoIcon && !node.isBranch"
              class="tree-select-label-info-container" style=""><i class="fas fa-info-circle" style="color: blue; margin-top: 5px"></i></span>
		</label>
	</treeselect>
</template>


<script>
import abstractField from "../abstractField";

export default {
	mixins: [abstractField],

	computed: {
		selectOptions() {
			return this.schema.selectOptions || {};
		},
		options() {
			let values = this.schema.values;
			return values.apply(this, [this.model, this.schema]);
		}
	},
	methods: {
		iconOnClick: function (node, type) {
			this.$parent.$parent.$parent.$emit("iconOnClick", node, type);
		},
		labelOnClick: function (node, type, closeOnLabelClick, isBranch) {
			if (closeOnLabelClick && !isBranch) {
				this.$children[0].closeMenu();
			}
		},
		mouseOver: function () {
		}
	}
};
</script>

<style lang="scss" scoped>
input {
	background-color: lighten(blue, 40%) !important;
	font-weight: bold;
}
</style>
