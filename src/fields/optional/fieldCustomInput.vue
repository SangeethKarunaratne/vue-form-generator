<template>
<div>
<input
		class="form-control"
		:id="getFieldID(schema)"
		:type="inputType"
		:value="value"
		@input="onInput"
		@blur="onBlur"
		:class="schema.fieldClasses"
		@change="schema.onChange || null"
		:disabled="disabled"
		:accept="schema.accept"
		:alt="schema.alt"
		:autocomplete="schema.autocomplete"
		:checked="schema.checked"
		:dirname="schema.dirname"
		:formaction="schema.formaction"
		:formenctype="schema.formenctype"
		:formmethod="schema.formmethod"
		:formnovalidate="schema.formnovalidate"
		:formtarget="schema.formtarget"
		:height="schema.height"
		:list="schema.list"
		:max="schema.max"
		:maxlength="schema.maxlength"
		:min="schema.min"
		:minlength="schema.minlength"
		:multiple="schema.multiple"
		:name="schema.inputName"
		:pattern="schema.pattern"
		:placeholder="schema.placeholder"
		:readonly="schema.readonly"
		:required="schema.required"
		:size="schema.size"
		:src="schema.src"
		:step="schema.step"
		:width="schema.width"
		:files="schema.files"
		v-attributes="'input'"
		v-b-tooltip="{
		title: this.value,
		placement: 'top',
		delay: 500,
		offset: 0,
		customClass: 'select-option-tooltip-hover',
		trigger: 'hover focus'
	}"
/>
<span v-if="schema.inputType.toLowerCase() === 'color' || schema.inputType.toLowerCase() === 'range'">{{ value }}</span>
</div>
</template>

<script>
import abstractField from "../abstractField";
import { debounce, get as objGet, isFunction, isNumber } from "lodash";
import fecha from "fecha";

const DATETIME_FORMATS = {
	date: "YYYY-MM-DD",
	datetime: "YYYY-MM-DD HH:mm:ss",
	"datetime-local": "YYYY-MM-DDTHH:mm:ss"
};

export default {
	mixins: [abstractField],
	computed: {
		inputType() {
			if(this.schema && this.schema.inputType === "datetime") {
				// convert "datetime" to "datetime-local" (datetime deprecated in favor of "datetime-local")
				// ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime
				return "datetime-local";
			}
			return this.schema.inputType;
		}
	},
	methods: {
		formatValueToModel(value) {
			if (value != null) {
				switch (this.schema.inputType.toLowerCase()) {
					case "date":
					case "datetime":
					case "datetime-local":
					case "range":
						// debounce
						return (newValue, oldValue) => {
							this.debouncedFormatFunc(value, oldValue);
						};
					case "number":
						return (newValue, oldValue) => {
							this.formatNumberToModel(value, oldValue);
						};
				}
			}

			return value;
		},
		formatValueToField(value) {
			switch(this.schema.inputType.toLowerCase()) {
				case "date":
				case "datetime":
				case "datetime-local":
					return this.formatDatetimeValueToField(value);
			}
			return value;
		},
		formatDatetimeToModel(newValue, oldValue) {
			let defaultFormat = DATETIME_FORMATS[this.schema.inputType.toLowerCase()];
			let m = fecha.parse(newValue, defaultFormat);
			if (m !== false) {
				if (this.schema.format) {
					newValue = fecha.format(m, this.schema.format);
				} else {
					newValue = m.valueOf();
				}
			}
			this.updateModelValue(newValue, oldValue);
		},
		formatDatetimeValueToField(value) {
			if(value === null || undefined === value) {
				return null;
			}

			let defaultFormat = DATETIME_FORMATS[this.schema.inputType.toLowerCase()];
			let m = value;
			if(!isNumber(value)) {
				m = fecha.parse(value, defaultFormat);
			}
			if(m !== false) {
				return fecha.format(m, defaultFormat);
			}
			return value;
		},
		formatNumberToModel(newValue, oldValue) {
			if (!isNumber(newValue)) {
				newValue = NaN;
			}
			this.updateModelValue(newValue, oldValue);
		},
		onInput($event) {
			let value = $event.target.value;
			switch (this.schema.inputType.toLowerCase()) {
				case "number":
				case "range":
					if (isNumber(parseFloat($event.target.value))) {
						value = parseFloat($event.target.value);
					}
					break;
			}
			this.value = value;
		},
		onBlur() {
			if (isFunction(this.debouncedFormatFunc)) {
				this.debouncedFormatFunc.flush();
			}
		}
	},

	mounted() {
		switch (this.schema.inputType.toLowerCase()) {
			case "number":
				return (newValue, oldValue) => {
					this.formatNumberToModel(newValue, oldValue);
				};
			case "range":
				this.debouncedFormatFunc = debounce(
					(newValue, oldValue) => {
						this.formatNumberToModel(newValue, oldValue);
					},
					parseInt(objGet(this.schema, "debounceFormatTimeout", 1000)),
					{
						trailing: true,
						leading: false
					}
				);
				break;
			case "date":
			case "datetime":
			case "datetime-local":
				// wait 1s before calling 'formatDatetimeToModel' to allow user to input data
				this.debouncedFormatFunc = debounce(
					(newValue, oldValue) => {
						this.formatDatetimeToModel(newValue, oldValue);
					},
					parseInt(objGet(this.schema, "debounceFormatTimeout", 1000)),
					{
						trailing: true,
						leading: false
					}
				);
				break;
		}
	},

	created() {
		if (this.schema.inputType.toLowerCase() === "file") {
			console.warn("The 'file' type in input field is deprecated. Use 'file' field instead.");
		}
	}
};
</script>

<style lang="scss">
.vue-form-generator .field-input {
	.wrapper {
		width: 100%;
	}
	input[type="radio"] {
		width: 100%;
	}
	input[type="color"] {
		width: 60px;
	}
	input[type="range"] {
		padding: 0;
	}

	.helper {
		margin: auto 0.5em;
	}
}
</style>
