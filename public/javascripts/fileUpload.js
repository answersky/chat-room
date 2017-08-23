/**
 * Created by Administrator on 2017/6/22.
 */
$(function () {
    $("a.fileUpload").click(function () {
        return $("#file").click();
    });
});

function uploadFile() {
    $("#form").submit();
}