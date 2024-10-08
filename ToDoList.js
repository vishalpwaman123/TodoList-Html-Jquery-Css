var noteUrl = "https://localhost:5001/";

$(document).ready(function () {
  GetNote();

  $(".submit-form").click(function () {
    var noteData = $("#noteInput").val();
    if (!noteData) {
      //   alert("Please Enter Required Fields");
      $("#noteSuggestionText").text("Note is required *");
      $("#noteSuggestionText").css({ color: "red" });
      $("#noteInput").css({ border: "1px solid red" });
      return;
    }
    CreateNote();
  });

  $(".edit-form").click(function () {
    var noteData = $("#noteInput").val();
    if (!noteData) {
      //   alert("Please Enter Required Fields");
      $("#noteSuggestionText").text("Note is required *");
      $("#noteSuggestionText").css({ color: "red" });
      $("#noteInput").css({ border: "1px solid red" });
      return;
    }
    editNoteOperation();
  });

  $(".cancel-edit-form").click(function () {
    ClearData();
  });

  $("#previous-Page").click(function () {
    var currentPage = Number($("#currentPage").val());
    if (currentPage === 0 || currentPage === 1) {
      currentPage = 1;
    } else {
      currentPage = currentPage - 1;
    }
    $("#currentPage").val(currentPage);
    GetNote();
  });

  $("#next-Page").click(function () {
    debugger;
    var currentPage = Number($("#currentPage").val());
    var totalPage = Number($("#totalPage").val());
    if (totalPage > currentPage) {
      currentPage = currentPage + 1;
    } else if (totalPage == currentPage) {
      //No operation perform
    }
    $("#currentPage").val(currentPage);
    GetNote();
  });
});

function CreateNote() {
  $.ajax({
    url: noteUrl + "api/ToDoList/InsertNote",
    type: "POST",
    contentType: "application/json",
    xhrFields: {},
    data: JSON.stringify(prepareRequest()),
    success: function (result) {
      GetNote();
      ClearData();
    },
    error: function () {},
  });
}

function editNoteOperation() {
  $.ajax({
    url: noteUrl + "api/ToDoList/UpdateNote",
    type: "PUT",
    contentType: "application/json",
    xhrFields: {},
    data: JSON.stringify(prepareRequest()),
    success: function (result) {
      ClearData();
      GetNote();
    },
    error: function () {},
  });
}

function ClearData() {
  $("#isEdit").val(false);
  $(".submit-form").show();
  $(".edit-form").hide();
  $(".cancel-edit-form").hide();
  $("#nodeId").val("0");
  $("#noteInput").val("");
  $("#scheduleDateInput").val("");
  $("#scheduleTimeInput").val("");
  document.getElementById("MonCheck").checked = false;
  document.getElementById("TueCheck").checked = false;
  document.getElementById("WedCheck").checked = false;
  document.getElementById("ThuCheck").checked = false;
  document.getElementById("FriCheck").checked = false;
  document.getElementById("SatCheck").checked = false;
  document.getElementById("SunCheck").checked = false;
}

function GetNote() {
  $.ajax({
    url: noteUrl + "api/ToDoList/GetNote",
    type: "POST",
    contentType: "application/json",
    xhrFields: {},
    data: JSON.stringify(prepareGetNoteRequest()),
    success: function (result) {
      if (result) {
        dataset = null;
        dataset = result.data;
        $("#totalPage").val(result.totalPages);
        $("#currentPage").val(
          result.currentPage === 0 ? 1 : result.currentPage
        );
        $(".pagination-text")
          .text("Current Page : ")
          .append(result.currentPage === 0 ? 1 : result.currentPage);
        $(".pagination-total-text")
          .text("Total Page : ")
          .append(result.totalPages);
        var table = document.getElementById("table-Data");
        table.innerHTML = "";
        for (let index = 0; index < dataset.length; index++) {
          // console.log(dataset[index]);
          var row = `<tr>
      <td>${dataset[index].noteId}</td>
      <td>${dataset[index].note}</td>
      <td>${
        dataset[index].scheduleDate === null
          ? "NA"
          : dataset[index].scheduleDate
      }</td>
      <td>${
        dataset[index].scheduleTime === null
          ? "NA"
          : dataset[index].scheduleTime
      }</td>

      <td>
        <input
          type="checkbox"
          class="form-check-input1"
          id="MonCheck"
          ${dataset[index].monday ? "checked" : "unchecked"}
        />
        <input
          type="checkbox"
          class="form-check-input2"
          id="TueCheck"
          ${dataset[index].tuesday ? "checked" : "unchecked"}
        />
        <input
          type="checkbox"
          class="form-check-input3"
          id="WedCheck"
          ${dataset[index].wednesday ? "checked" : "unchecked"}
        />
        <input
          type="checkbox"
          class="form-check-input4"
          id="ThuCheck"
          ${dataset[index].thursday ? "checked" : "unchecked"}
        />
        <input
          type="checkbox"
          class="form-check-input5"
          id="FriCheck"
          ${dataset[index].friday ? "checked" : "unchecked"}
        />
        <input
          type="checkbox"
          class="form-check-input6"
          id="SatCheck"
          ${dataset[index].saturday ? "checked" : "unchecked"}
        />
        <input
          type="checkbox"
          class="form-check-input7"
          id="SunCheck"
          ${dataset[index].sunday ? "checked" : "unchecked"}
        />
      </td>
      <td>
        <a class="btn btn-outline-info" id="editButton" onclick="editNote(${
          dataset[index].noteId
        })" value=${dataset[index].noteId}>Edit</a>
        <a class="btn btn-outline-dark mx-2" id="deleteButton" onclick="deleteNote(${
          dataset[index].noteId
        })" value=${dataset[index].noteId}>Delete</a></td>
      </tr>`;
          table.innerHTML += row;
          // $("#table-Data").append(row);
        }

        // pagination();
      } else {
        console.log("Notes Not Found");
      }
    },
    error: function () {},
  });
}

function prepareRequest() {
  idData = $("#isEdit").val() === "true" ? Number($("#noteId").val()) : 0;
  noteData = $("#noteInput").val();
  scheduleDateInput = $("#scheduleDateInput").val();
  scheduleTimeInput = $("#scheduleTimeInput").val();
  MonCheck = $("#MonCheck").is(":checked");
  TueCheck = $("#TueCheck").is(":checked");
  WedCheck = $("#WedCheck").is(":checked");
  ThuCheck = $("#ThuCheck").is(":checked");
  FriCheck = $("#FriCheck").is(":checked");
  SatCheck = $("#SatCheck").is(":checked");
  SunCheck = $("#SunCheck").is(":checked");
  debugger;
  return {
    id: idData,
    note: noteData,
    scheduleDate: scheduleDateInput === "" ? null : scheduleDateInput,
    scheduleTime: scheduleTimeInput === "" ? null : scheduleTimeInput,
    monday: MonCheck,
    tuesday: TueCheck,
    wednesday: WedCheck,
    thursday: ThuCheck,
    friday: FriCheck,
    saturday: SatCheck,
    sunday: SunCheck,
  };
}

function pagination() {
  currentPage = Number($("#currentPage").val());
  totalPage = Number($("#totalPage").val());
  var table = document.getElementById("pageList");
  for (let index = 1; index <= totalPage; index++) {
    var row = `
    <li class='${index === currentPage ? "page-item active" : "page-item"}'>
      <a class="page-link"
       value='${index}' id='page${index}'>${index}</a>
    </li>
`;
    table.innerHTML += row;
  }
}

function prepareGetNoteRequest() {
  pageNumber = $("#currentPage").val();
  sort = $("#sortStatus").val();
  debugger;
  return {
    pageNumber: Number(pageNumber),
    numberOfRecordPerPage: 4,
    sortBy: sort,
  };
}

function GetNoteByID(Id) {
  $.ajax({
    url: noteUrl + "api/ToDoList/GetNoteById?Id=" + Id,
    type: "GET",
    contentType: "application/json",
    xhrFields: {},
    data: null,
    success: function (result) {
      console.log(result.data);
      if (result.isSuccess) {
        debugger;
        $("#nodeId").val(result.data.id);
        $("#noteInput").val(result.data.note);
        $("#scheduleDateInput").val(result.data.scheduleDate);
        $("#scheduleTimeInput").val(result.data.scheduleTime);
        document.getElementById("MonCheck").checked = result.data.monday;
        document.getElementById("TueCheck").checked = result.data.tuesday;
        document.getElementById("WedCheck").checked = result.data.wednesday;
        document.getElementById("ThuCheck").checked = result.data.thursday;
        document.getElementById("FriCheck").checked = result.data.friday;
        document.getElementById("SatCheck").checked = result.data.saturday;
        document.getElementById("SunCheck").checked = result.data.sunday;
      }
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function editNote(Id) {
  $("#noteId").val(Id);
  $("#isEdit").val(true);
  $(".submit-form").hide();
  $(".edit-form").show();
  $(".cancel-edit-form").show();
  GetNoteByID(Id);
}

function deleteNote(Id) {
  // alert("Hello Delete : " + Id);
  $.ajax({
    url: noteUrl + "api/ToDoList/DeleteNote?Id=" + Id,
    type: "DELETE",
    contentType: "application/json",
    xhrFields: {},
    data: null,
    success: function (result) {
      console.log(result);
      GetNote();
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function radioInput(status) {
  // alert(status);
  $("#sortStatus").val(status);
  $("#totalPage").val(1);
  GetNote();
}
