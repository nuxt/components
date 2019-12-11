import Vue from 'vue'
<% options.components.forEach(({ name, path }) => { %>import <%= name %> from '<%= path %>'
<% }) %>

<% options.components.forEach(({ name }) => { %>
Vue.component(<% if (!options.ignoreNameDetection) { %><%= name %>.name || <% } %>'<%= name %>', <%= name %>)
<% }) %>
