angular.module('solicitudPrestamo')
.controller('takePictureController', function($scope) {
    var _video = null;
    var patData = null;

    $scope.patOpts = {x: 0, y: 0, w: 25, h: 25};
    $scope.channel = {};

    $scope.webcamError = false;
    $scope.onError = function (err) {
        $scope.$apply(
            function() {
                $scope.webcamError = err;
            }
        );
    };

    $scope.onSuccess = function () {
        // The video element contains the captured camera data
          _video = $scope.channel.video;
        $scope.$apply(function() {
            $scope.patOpts.w = _video.width;
            $scope.patOpts.h = _video.height;
            //$scope.showDemos = true;
        });
    };

    $scope.onStream = function (stream) {
        // You could do something manually with the stream.
    };

	$scope.makeSnapshot = function() {
        if (_video) {
            $scope.isFirst= true;

            var patCanvas = document.querySelector('#snapshot');
            if (!patCanvas) return;

            patCanvas.width = _video.width;
            patCanvas.height = _video.height;
            var ctxPat = patCanvas.getContext('2d');

            var idata = getVideoData($scope.patOpts.x, $scope.patOpts.y, $scope.patOpts.w, $scope.patOpts.h);
            ctxPat.putImageData(idata, 0, 0);

            sendSnapshotToServer(patCanvas.toDataURL());

            patData = idata;
        }
    };
    
    var getVideoData = function getVideoData(x, y, w, h) {
        var hiddenCanvas = document.createElement('canvas');
        hiddenCanvas.width = _video.width;
        hiddenCanvas.height = _video.height;
        var ctx = hiddenCanvas.getContext('2d');
        ctx.drawImage(_video, 0, 0, _video.width, _video.height);
        return ctx.getImageData(x, y, w, h);
    };

    var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
        $scope.snapshotData = imgBase64;
    };
});