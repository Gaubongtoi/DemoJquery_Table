let data = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    gender: "Male",
    email: "Yes",
    math: 8,
    physics: 7,
    chemistry: 9,
  },
  {
    id: 2,
    name: "Trần Thị B",
    gender: "Female",
    email: "No",
    math: 6,
    physics: 8,
    chemistry: 7,
  },
  {
    id: 3,
    name: "Phạm Minh C",
    gender: "Male",
    email: "Yes",
    math: 9,
    physics: 9,
    chemistry: 10,
  },
];

console.log(data);

function renderTable() {
  const $tbody = $("#info-table tbody");
  $tbody.empty(); // Xóa bảng trước khi thêm lại dữ liệu mới
  let totalMath = 0,
    totalPhysics = 0,
    totalChemistry = 0;

  // Kiểm tra nếu không có dữ liệu
  if (data.length === 0) {
    $("#avg-math").text("0");
    $("#avg-physics").text("0");
    $("#avg-chemistry").text("0");
    $("#avg-total").text("0");
    return; // Dừng lại nếu không có dữ liệu
  }

  data.forEach((student, index) => {
    const avg = (
      (student.math + student.physics + student.chemistry) /
      3
    ).toFixed(2);

    totalMath += student.math;
    totalPhysics += student.physics;
    totalChemistry += student.chemistry;

    // Thêm dữ liệu vào bảng
    $tbody.append(`
          <tr data-id="${student.id}">
            <td><input type="checkbox" name="selected"></td>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.email}</td>
            <td>${student.math}</td>
            <td>${student.physics}</td>
            <td>${student.chemistry}</td>
            <td>${avg}</td>
            <td>
              <button class="editBtn">Edit</button>
            </td>
            <td>
              <button class="deleteBtn">Remove</button>
            </td>
          </tr>
        `);
  });

  const totalStudents = data.length;
  console.log("Re-render");

  // Tính toán trung bình
  $("#avg-math").text((totalMath / totalStudents).toFixed(2));
  $("#avg-physics").text((totalPhysics / totalStudents).toFixed(2));
  $("#avg-chemistry").text((totalChemistry / totalStudents).toFixed(2));
  $("#avg-total").text(
    ((totalMath + totalPhysics + totalChemistry) / (totalStudents * 3)).toFixed(
      2
    )
  );
}

function toggleDeleteButton() {
  const anyChecked =
    $("input[type='checkbox'][name='selected']:checked").length > 0;

  if (anyChecked) {
    $("#delete-selected-btn").removeClass("hidden");
  } else {
    $("#delete-selected-btn").addClass("hidden");
  }
  if (data.length === 0) {
    $("#check-all").prop("checked", false);
  } else {
    const allChecked =
      $("input[type='checkbox'][name='selected']").length ===
      $("input[type='checkbox'][name='selected']:checked").length;
    $("#check-all").prop("checked", allChecked);
  }
}

$(document).ready(function () {
  renderTable();

  // Add button
  $("#add-new-btn").on("click", () => {
    $("#popup_add").removeClass("hidden");
  });

  // Add information
  $("#add-form").on("submit", function (e) {
    e.preventDefault();
    const formData = {
      id: data[data.length - 1]?.id ? data[data.length - 1].id + 1 : 1,
      name: $("#name").val(),
      gender: $('input[name="gender"]:checked').val(),
      email: $("#email").is(":checked") ? "Yes" : "No",
      math: parseFloat($("#math").val()),
      physics: parseFloat($("#physics").val()),
      chemistry: parseFloat($("#chemistry").val()),
    };
    data.push(formData);
    $("#popup_add").addClass("hidden");
    $("#add-form")[0].reset();
    renderTable();
  });

  // Cancel button Add
  $("#cancel-btn").on("click", () => {
    $("#popup_add").addClass("hidden");
  });

  // Open Edit Modal
  $(document).on("click", ".editBtn", function () {
    const row = $(this).closest("tr");
    const id = parseInt(row.data("id"));
    $("#popup_edit").data("id", id);
    const student = data.find((student) => student.id === id);
    $("#name_edit").val(student.name);
    $("input[name='gender_edit'][value='" + student.gender + "']").prop(
      "checked",
      true
    );
    $("#email_edit").prop("checked", student.email === "Yes");
    $("#math_edit").val(student.math);
    $("#physics_edit").val(student.physics);
    $("#chemistry_edit").val(student.chemistry);
    $("#popup_edit").removeClass("hidden");
  });

  // Save Change Data
  $("#edit-form").on("submit", function (e) {
    e.preventDefault();
    const updatedStudent = {
      id: $("#popup_edit").data("id"),
      name: $("#name_edit").val(),
      gender: $("input[name='gender_edit']:checked").val(),
      email: $("#email_edit").prop("checked") ? "Yes" : "No",
      math: parseFloat($("#math_edit").val()),
      physics: parseFloat($("#physics_edit").val()),
      chemistry: parseFloat($("#chemistry_edit").val()),
    };
    const index = data.findIndex((student) => student.id === updatedStudent.id);
    if (index !== -1) {
      data[index] = updatedStudent;
    }
    $("#popup_edit").addClass("hidden");
    renderTable();
  });

  // Close Edit Modal
  $("#cancel-btn_edit").on("click", () => {
    $("#popup_edit").addClass("hidden");
  });

  // Open Confirmation Modal
  $(document).on("click", ".deleteBtn", function () {
    const row = $(this).closest("tr");
    const id = parseInt(row.data("id"));
    $("#popup_confirm").data("id", id);
    $("#popup_confirm").removeClass("hidden");
  });
  $(document).on("click", "#confirm-btn_confirmation", function () {
    console.log($("#popup_confirm").data("id"));
    data = data.filter(
      (student) => student.id !== $("#popup_confirm").data("id")
    );
    $("#popup_confirm").addClass("hidden");
    renderTable();
  });

  // Close Confirmation Modal
  $("#cancel-btn_confirmation").on("click", () => {
    $("#popup_confirm").addClass("hidden");
  });

  // Check All functionality
  $(document).on("change", "#check-all", function () {
    const isChecked = $(this).prop("checked");
    $("input[type='checkbox'][name='selected']").prop("checked", isChecked);
    toggleDeleteButton();
  });

  $(document).on(
    "change",
    "input[type='checkbox'][name='selected']",
    function () {
      toggleDeleteButton();
    }
  );

  // Delete selected rows
  $(document).on("click", "#delete-selected-btn", function () {
    const selectedIds = [];
    $("input[type='checkbox'][name='selected']:checked").each(function () {
      const row = $(this).closest("tr");
      const id = parseInt(row.data("id"));
      selectedIds.push(id);
    });
    data = data.filter((student) => !selectedIds.includes(student.id));
    renderTable();
    toggleDeleteButton();
  });
});
