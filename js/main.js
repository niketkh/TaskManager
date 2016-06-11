$(document).ready(function(){

	$('#add_category').submit(addCategory);
	$('#edit_category').submit(editCategory);

	$('#add_task').submit(addTask);
	$('#edit_task').submit(editTask);

	$('body').on('click', '.btn-edit-category', setCategory);
	$('body').on('click', '.btn-delete-category', deleteCategory);


	$('body').on('click', '.btn-edit-task', setTask);
	$('body').on('click', '.btn-delete-task', deleteTask);

});

var myAPIKey = 'bfTZjbwoZZKglIDfdRV4P1N1SSxPehsr';

function getTasks(){
	$.get("https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey=" + myAPIKey, function(data){
		var output = '<ul class="list-group">';
		$.each(data, function(key, data){
			output += '<li class="list-group-item task">';
			output += data.task_name + '<span class="due_on">   [Due on ' + data.due_date + ']   </span>';
						if(data.is_urgent == "true"){
							output += '<span class="label label-danger">Urgent</span>';
						}
			output += '<div class="pull-right"><a class="btn btn-primary btn-edit-task" data-task-name="' + data.task_name + '" data-task-id="' + data._id.$oid + '">Edit</a> <a class="btn btn-danger btn-delete-task" data-task-id="' + data._id.$oid + '">Delete</a></div>'; 
			output += '</li>';
		})

		output += '</ul>'
		$('#tasks').html(output);
	})
}

function addTask(){
	var task_name = $('#task_name').val();
	var category = $('#category').val();
	var due_date = $('#due_date').val();
	var is_urgent = $('#is_urgent').val();
	$.ajax({ url: "https://api.mlab.com/api/1/databases/taskmanager/collections/tasks?apiKey=" + myAPIKey,
		data: JSON.stringify({
		   "task_name" : task_name,
		   "category": category,
		   "due_date": due_date,
		   "is_urgent": is_urgent 
		}),
		  type: "POST",
		  contentType: "application/json",
		  success:  function(data){
		  	window.location.href = 'index.html'
		  },
		  error: function(xhr, status, error){
		  	console.log(err)
		  } 
	});
	return false;
}

function setTask(){
	var task_id = $(this).data('task-id');
	var task_name = $(this).data('task-name')
	console.log("Task id: " + task_id);
	console.log("Task Name: " + task_name);
	sessionStorage.setItem('currentTaskId', task_id);
	sessionStorage.setItem('currentTaskName', task_name);
	window.location.href = 'edittask.html';
	return false;
}

function getTask(){
	var task_id = sessionStorage.getItem('currentTaskId');
	var task_name = sessionStorage.getItem('currentTaskName');
	console.log("Task id: " + task_id);
	console.log("Task Name: " + task_name);
	$.get("https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/" + task_id + "?apiKey=" + myAPIKey, function(data){
		$('#task_name').val(data.task_name);
		$('#category').val(data.category);
		$('#due_date').val(data.due_date);
		$('#is_urgent').val(data.is_urgent);
	});

}

function editTask(){
	var task_id = sessionStorage.getItem('currentTaskId');
	var task_name = $('#task_name').val();
	var category = $('#category').val();
	var due_date = $('#due_date').val();
	var is_urgent = $('#is_urgent').val();
	console.log("Task id: " + task_id);
	console.log("Task Name: " + task_name);
	$.ajax({ url: "https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/" + task_id + "?apiKey=" + myAPIKey,
		data: JSON.stringify({
		   "task_name": task_name,
		   "category": category,
		   "due_date": due_date,
		   "is_urgent": is_urgent 
		}),
		type: "PUT",
		contentType: "application/json",
		success:  function(data){
		 	window.location.href = 'index.html'
		},
		error: function(xhr, status, error){
		 	console.log(err)
		} 
	});
	return false;
}

function deleteTask(){
	var task_id = $(this).data('task-id');
	console.log(task_id);
	$.ajax({ url: "https://api.mlab.com/api/1/databases/taskmanager/collections/tasks/" + task_id + "?apiKey=" + myAPIKey,
		  type: "DELETE",
		  async: true,
		  timeout: 300000,
		  success:  function(data){
		  	window.location.href = 'index.html'
		  },
		  error: function(xhr, status, error){
		  	console.log(err)
		  } 
	});
	return false;
}

function getCategories(){
	$.get("https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=" + myAPIKey, function(data){
		var output = '<ul class="list-group">';
		$.each(data, function(key, data){
			output += '<li class="list-group-item category">' +
					data.category_name +  
					'<div class="pull-right"><a class="btn btn-primary btn-edit-category" data-category-id="' + data._id.$oid + '">Edit</a> <a class="btn btn-danger btn-delete-category" data-category-id="' + data._id.$oid + '">Delete</a></div>' 
					'</li>';
		})

		output += '</ul>'
		$('#categories').html(output)
	})
}

function getCategoryOptions(){
	$.get("https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=" + myAPIKey, function(data){
		var output;
		$.each(data, function(key, data){
			console.log(data);
			output += '<option value="' + data.category_name +  '">' + data.category_name + '</option>';
		})

		$('#category').append(output);
	})
	
}

function addCategory(){
	var category_name = $('#category_name').val();
	$.ajax({ url: "https://api.mlab.com/api/1/databases/taskmanager/collections/categories?apiKey=" + myAPIKey,
		data: JSON.stringify({
		   "category_name" : category_name 
		}),
		  type: "POST",
		  contentType: "application/json",
		  success:  function(data){
		  	window.location.href = 'categories.html'
		  },
		  error: function(xhr, status, error){
		  	console.log(err)
		  } 
	});
	return false;
}

function editCategory(){
	var category_id = sessionStorage.getItem('currentCategoryId');
	var category_name = $('#category_name').val();
	$.ajax({ url: "https://api.mlab.com/api/1/databases/taskmanager/collections/categories/" + category_id + "?apiKey=" + myAPIKey,
		data: JSON.stringify({
		   "category_name" : category_name 
		}),
		  type: "PUT",
		  contentType: "application/json",
		  success:  function(data){
		  	window.location.href = 'categories.html'
		  },
		  error: function(xhr, status, error){
		  	console.log(err)
		  } 
	});
	return false;
}

function setCategory(){
	var category_id = $(this).data('category-id');
	// console.log("Category id: " + category_id);
	sessionStorage.setItem('currentCategoryId', category_id);
	window.location.href = 'editcategory.html';
	return false;
}

function getCategory(){
	var category_id = sessionStorage.getItem('currentCategoryId');
	// console.log("Category id: " + category_id);
	$.get("https://api.mlab.com/api/1/databases/taskmanager/collections/categories/" + category_id + "?apiKey=" + myAPIKey, function(data){
		$('#category_name').val(data.category_name);
	});

}

function deleteCategory(){
	var category_id = $(this).data('category-id');
	$.ajax({ url: "https://api.mlab.com/api/1/databases/taskmanager/collections/categories/" + category_id + "?apiKey=" + myAPIKey,
		
		  type: "DELETE",
		  async: true,
		  timeout: 300000,
		  success:  function(data){
		  	window.location.href = 'categories.html'
		  },
		  error: function(xhr, status, error){
		  	console.log(err)
		  } 
	});
	return false;
}

