package com.esisba.msarabelanguage.fileManagement.exception;//package com.esisba.msarabelanguage.fileManagement.exception;
//
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
//
//@ControllerAdvice
//public class FileExceptionAdvice extends ResponseEntityExceptionHandler {
//
//  /*  @ExceptionHandler(FileNotFoundException.class)
//    public ResponseEntity<Object> handleFileNotFoundExceptio(FileNotFoundException exc) {
//
//        List<String> details = new ArrayList<String>();
//        details.add(exc.getMessage());
//        ResponseError err = new ResponseError(LocalDateTime.now(), "File Not Found" ,details);
//        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
//    }
//
//    @ExceptionHandler(MaxUploadSizeExceededException.class)
//    public ResponseEntity<Object> handleMaxSizeExceptio(MaxUploadSizeExceededException exc) {
//
//        List<String> details = new ArrayList<String>();
//        details.add(exc.getMessage());
//        ResponseError err = new ResponseError(LocalDateTime.now(), "File Size Exceeded" ,details);
//        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(err);
//    }*/
//}