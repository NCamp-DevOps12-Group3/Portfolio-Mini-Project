$(()=>{
    $("#sidebar-content-search-btn").on("click", function(e){
        e.preventDefault();
        const searchTap = $(".sidebar-content-search");
        if(searchTap.css("display") === "none"){
            searchTap.show();
        }else{
            searchTap.hide();
        }
    });
});