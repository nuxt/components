import Vue from 'vue'
<% options.forEach(({ name, path }) => { %>import <%= name %> from '<%= path %>'
<% }) %>

<% options.forEach(({ name }) => { %>Vue.component(<%= name %>.name || '<%= name %>', <%= name %>)
<% }) %>
