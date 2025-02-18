let VueFormGenerator = window.VueFormGenerator;

let vm = new Vue({
	el: "#app",
	components: {
		"vue-form-generator": VueFormGenerator.component
	},

	methods: {
		prettyJSON: function (json) {
			if (json) {
				json = JSON.stringify(json, undefined, 4);
				json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
				return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
					let cls = "number";
					if (/^"/.test(match)) {
						if (/:$/.test(match)) {
							cls = "key";
						} else {
							cls = "string";
						}
					} else if (/true|false/.test(match)) {
						cls = "boolean";
					} else if (/null/.test(match)) {
						cls = "null";
					}
					return "<span class=\"" + cls + "\">" + match + "</span>";
				});
			}
		}
	},

	data: {
		model: {
			id: 1,
			name: "John Doe",
			password: "J0hnD03!x4",
			skills: "Javascript",
			email: "john.doe@gmail.com",
			status: true,
			list: 'a',
		},
		schema: {
			fields: [
				{
					type: "treeSelect",
					label: "Tree Select",
					model: "list",
					valueFormat: "object",
					selectOptions: {
						type: "list",
						searchable: true,
						closeOnSelect: false,
						showInfoIcon: true,
					},
					values: function (){
						return [
							{
								id: "a",
								label: "a",
								children: [
									{
										id: "aa",
										label: "aa",
									},
									{
										id: "ab",
										label: "ab",
									}
								]
							},
							{
								id: "c",
								label: "c",
								children: [
									{
										id: "ca",
										label: "ca",
									},
									{
										id: "cb",
										label: "cb",
									}
								]
							}
						];
					}
				},
				{
					type: "input",
					inputType: "text",
					label: "ID",
					model: "id",
					inputName: "id",
					readonly: true,
					featured: false,
					disabled: true
				},
				{
					type: "input",
					inputType: "text",
					label: "Name",
					model: "name",
					inputName: "name",
					readonly: false,
					featured: true,
					required: true,
					disabled: false,
					placeholder: "User's name",
					validator: VueFormGenerator.validators.string
				},
				{
					type: "input",
					inputType: "password",
					label: "Password",
					model: "password",
					inputName: "password",
					min: 6,
					required: true,
					hint: "Minimum 6 characters",
					validator: VueFormGenerator.validators.string
				},
				{
					type: "input",
					inputType: "email",
					label: "E-mail",
					model: "email",
					inputName: "email",
					placeholder: "User's e-mail address",
					validator: VueFormGenerator.validators.email
				},
				{
					type: "select",
					label: "Skills",
					model: "skills",
					inputName: "skills",
					required: true,
					values: [
						"HTML5",
						"Javascript",
						"CSS3",
						"CoffeeScript",
						"AngularJS",
						"ReactJS",
						"VueJS"
					],
					validator: VueFormGenerator.validators.string
				}, {
					type: "upload",
					label: "Photo",
					model: "photo",
					inputName: "photo",
					onChanged(model, schema, event) {
						console.log(model, schema, event);
					}
				},
				{
					type: "checkbox",
					label: "Status",
					model: "status",
					inputName: "status",
					multi: true,
					readonly: false,
					featured: false,
					disabled: false,
					default: true
				},
				{
					type: "submit",
					label: "",
					buttonText: "Submit",
					validateBeforeSubmit: true
				}

			]
		},

		formOptions: {
			validateAfterLoad: false,
			validateAfterChanged: false
		}
	}
});
