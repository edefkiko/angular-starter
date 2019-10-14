app.filter('toTrusted', function ($sce) {
    return function (value) {
        return $sce.trustAsHtml(value);
    };
});